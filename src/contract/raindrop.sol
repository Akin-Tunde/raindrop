// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RaindropEscrow (V2)
 * @dev Smart contract for escrowing tokens and executing gas-efficient batch transfers.
 */
contract RaindropEscrow is ReentrancyGuard, Ownable(msg.sender) {
    using SafeERC20 for IERC20;

    uint256 public constant MAX_PARTICIPANTS = 1_000_000;
    uint256 public constant MAX_EXECUTION_PARTICIPANTS = 10_000; // Soft cap to prevent gas limit issues
    uint256 public constant MIN_AMOUNT_PER_PARTICIPANT = 100;

    uint256 public platformFeeBps;
    address public feeRecipient;

    struct Raindrop {
        address host;
        address token;
        uint256 totalAmount;
        uint64 scheduledTime;
        uint32 participantCount;
        bool executed;
        bool cancelled;
        mapping(address => uint256) participantIndex; // 1-based index
        address[] participantList;
    }

    mapping(string => Raindrop) private raindrops;

    // --- Errors ---
    error AlreadyExists(string raindropId);
    error NotFound(string raindropId);
    error NotAuthorized();
    error AlreadyExecuted();
    error AlreadyCancelled();
    error InvalidConfiguration(string reason);
    error InvalidInput(string reason);
    error ExecutionFailed(string reason);

    // --- Events ---
    event RaindropCreated(string indexed raindropId, address indexed host, address indexed token, uint256 totalAmount, uint256 scheduledTime);
    event RaindropExecuted(string indexed raindropId, uint256 participantCount, uint256 amountPerParticipant);
    event RaindropCancelled(string indexed raindropId, address indexed host, uint256 refundAmount);
    event ParticipantsAdded(string indexed raindropId, uint256 count);
    event ParticipantsRemoved(string indexed raindropId, uint256 count);
    event ParticipantsCleared(string indexed raindropId);
    event PlatformFeeUpdated(uint256 newFeeBps);
    event FeeRecipientUpdated(address newFeeRecipient);

    constructor(address initialFeeRecipient, uint256 initialFeeBps) {
        if (initialFeeRecipient == address(0)) revert InvalidInput("Fee recipient cannot be zero address");
        if (initialFeeBps > 100) revert InvalidInput("Fee cannot exceed 1%");
        feeRecipient = initialFeeRecipient;
        platformFeeBps = initialFeeBps;
    }

    // --- Core Functions ---

    function createRaindrop(string calldata raindropId, address token, uint256 totalAmount, uint256 scheduledTime) external nonReentrant {
        if (_exists(raindropId)) revert AlreadyExists(raindropId);
        if (token == address(0)) revert InvalidInput("Invalid token address");
        if (totalAmount == 0) revert InvalidInput("Amount must be greater than 0");
        if (scheduledTime <= block.timestamp) revert InvalidInput("Scheduled time must be in the future");

        Raindrop storage rd = raindrops[raindropId];
        rd.host = msg.sender;
        rd.token = token;
        rd.scheduledTime = uint64(scheduledTime);

        IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);
        rd.totalAmount = totalAmount;

        emit RaindropCreated(raindropId, msg.sender, token, totalAmount, scheduledTime);
    }

    function addParticipants(string calldata raindropId, address[] calldata newParticipants) external {
        Raindrop storage rd = _getRaindrop(raindropId);
        _onlyHostOrOwner(rd.host);
        _notExecutedOrCancelled(rd);

        uint256 currentCount = rd.participantCount;

        for (uint256 i = 0; i < newParticipants.length; i++) {
            address p = newParticipants[i];
            if (p == address(0) || p == rd.host) continue;

            if (rd.participantIndex[p] == 0) {
                rd.participantList.push(p);
                rd.participantIndex[p] = rd.participantList.length; // 1-based index
            }
        }

        rd.participantCount = uint32(rd.participantList.length);
        if (rd.participantCount > MAX_PARTICIPANTS) revert InvalidInput("Exceeds max participant limit");

        _validateAmountPerParticipant(rd);

        emit ParticipantsAdded(raindropId, rd.participantCount - currentCount);
    }

    function removeParticipants(string calldata raindropId, address[] calldata participantsToRemove) external {
        Raindrop storage rd = _getRaindrop(raindropId);
        _onlyHostOrOwner(rd.host);
        _notExecutedOrCancelled(rd);

        uint256 removed = 0;

        for (uint256 i = 0; i < participantsToRemove.length; i++) {
            address p = participantsToRemove[i];
            uint256 index = rd.participantIndex[p];

            if (index > 0) {
                address last = rd.participantList[rd.participantList.length - 1];
                rd.participantList[index - 1] = last;
                rd.participantIndex[last] = index;
                rd.participantList.pop();
                delete rd.participantIndex[p];
                removed++;
            }
        }

        rd.participantCount -= uint32(removed);
        emit ParticipantsRemoved(raindropId, removed);
    }

    function clearParticipants(string calldata raindropId) external {
        Raindrop storage rd = _getRaindrop(raindropId);
        _onlyHostOrOwner(rd.host);
        _notExecutedOrCancelled(rd);

        for (uint256 i = 0; i < rd.participantList.length; i++) {
            delete rd.participantIndex[rd.participantList[i]];
        }

        delete rd.participantList;
        rd.participantCount = 0;

        emit ParticipantsCleared(raindropId);
    }

    function executeRaindrop(string calldata raindropId) external nonReentrant {
        Raindrop storage rd = _getRaindrop(raindropId);
        _onlyHostOrOwner(rd.host);
        _notExecutedOrCancelled(rd);

        if (block.timestamp < rd.scheduledTime) revert ExecutionFailed("Too early to execute");
        if (rd.participantCount == 0) revert ExecutionFailed("No participants");

        if (platformFeeBps > 0 && feeRecipient == address(0)) revert InvalidConfiguration("Fee recipient not set");
        if (rd.participantCount > MAX_EXECUTION_PARTICIPANTS) revert ExecutionFailed("Too many participants; use batched execution");

        rd.executed = true;

        uint256 platformFee = (rd.totalAmount * platformFeeBps) / 10000;
        uint256 distributable = rd.totalAmount - platformFee;
        uint256 amountPerParticipant = distributable / rd.participantCount;
        uint256 distributed = amountPerParticipant * rd.participantCount;
        uint256 remainder = distributable - distributed;

        IERC20 token = IERC20(rd.token);

        for (uint256 i = 0; i < rd.participantCount; i++) {
            token.safeTransfer(rd.participantList[i], amountPerParticipant);
        }

        if (platformFee > 0) token.safeTransfer(feeRecipient, platformFee);
        if (remainder > 0) token.safeTransfer(rd.host, remainder);

        emit RaindropExecuted(raindropId, rd.participantCount, amountPerParticipant);
    }

    function cancelRaindrop(string calldata raindropId) external nonReentrant {
        Raindrop storage rd = _getRaindrop(raindropId);
        _onlyHostOrOwner(rd.host);
        _notExecutedOrCancelled(rd);

        rd.cancelled = true;
        IERC20(rd.token).safeTransfer(rd.host, rd.totalAmount);

        emit RaindropCancelled(raindropId, rd.host, rd.totalAmount);
    }

    // --- Getters ---

    function getRaindropDetails(string calldata raindropId) external view returns (
        address host, address token, uint256 totalAmount, uint256 scheduledTime, bool executed, bool cancelled, uint256 participantCount
    ) {
        Raindrop storage rd = _getRaindrop(raindropId);
        return (rd.host, rd.token, rd.totalAmount, rd.scheduledTime, rd.executed, rd.cancelled, rd.participantCount);
    }

    function getParticipantsPaginated(string calldata raindropId, uint256 cursor, uint256 size) external view returns (address[] memory) {
        Raindrop storage rd = _getRaindrop(raindropId);
        uint256 length = size;
        if (cursor + size > rd.participantCount) {
            length = rd.participantCount - cursor;
        }

        address[] memory slice = new address[](length);
        for (uint256 i = 0; i < length; i++) {
            slice[i] = rd.participantList[cursor + i];
        }

        return slice;
    }

    function getParticipantCount(string calldata raindropId) external view returns (uint256) {
        return _getRaindrop(raindropId).participantCount;
    }

    // --- Admin ---

    function updatePlatformFee(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > 100) revert InvalidInput("Fee cannot exceed 1%");
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(newFeeBps);
    }

    function updateFeeRecipient(address newRecipient) external onlyOwner {
        if (newRecipient == address(0)) revert InvalidInput("Fee recipient cannot be zero");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }

    function emergencyRecoverToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }

    // --- Internal Helpers ---

    function _validateAmountPerParticipant(Raindrop storage rd) internal view {
        if (rd.participantCount == 0) return;
        uint256 fee = (rd.totalAmount * platformFeeBps) / 10000;
        uint256 distributable = rd.totalAmount - fee;
        if (distributable / rd.participantCount < MIN_AMOUNT_PER_PARTICIPANT) {
            revert ExecutionFailed("Amount per participant is below minimum");
        }
    }

    function _onlyHostOrOwner(address host) internal view {
        if (msg.sender != host && msg.sender != owner()) revert NotAuthorized();
    }

    function _notExecutedOrCancelled(Raindrop storage rd) internal view {
        if (rd.executed) revert AlreadyExecuted();
        if (rd.cancelled) revert AlreadyCancelled();
    }

    function _getRaindrop(string calldata raindropId) internal view returns (Raindrop storage rd) {
        rd = raindrops[raindropId];
        if (rd.token == address(0)) revert NotFound(raindropId);
    }

    function _exists(string calldata raindropId) internal view returns (bool) {
        return raindrops[raindropId].token != address(0);
    }
}
