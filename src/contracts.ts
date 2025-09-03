// src/config.ts
export const contractAddress = "0xF044F3cB3d31BD7131542eDAe10b0e4F090810b8";

// The full ABI from your compiled contract's JSON file
export const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialFeeRecipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "initialFeeBps",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "AlreadyCancelled",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "AlreadyExecuted",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			}
		],
		"name": "AlreadyExists",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "ExecutionFailed",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "InvalidConfiguration",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "reason",
				"type": "string"
			}
		],
		"name": "InvalidInput",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotAuthorized",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			}
		],
		"name": "NotFound",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			}
		],
		"name": "SafeERC20FailedOperation",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "newFeeRecipient",
				"type": "address"
			}
		],
		"name": "FeeRecipientUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "ParticipantsAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			}
		],
		"name": "ParticipantsCleared",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "count",
				"type": "uint256"
			}
		],
		"name": "ParticipantsRemoved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newFeeBps",
				"type": "uint256"
			}
		],
		"name": "PlatformFeeUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "host",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refundAmount",
				"type": "uint256"
			}
		],
		"name": "RaindropCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "host",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "scheduledTime",
				"type": "uint256"
			}
		],
		"name": "RaindropCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "participantCount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountPerParticipant",
				"type": "uint256"
			}
		],
		"name": "RaindropExecuted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MAX_EXECUTION_PARTICIPANTS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_PARTICIPANTS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MIN_AMOUNT_PER_PARTICIPANT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"internalType": "address[]",
				"name": "newParticipants",
				"type": "address[]"
			}
		],
		"name": "addParticipants",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			}
		],
		"name": "cancelRaindrop",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			}
		],
		"name": "clearParticipants",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "scheduledTime",
				"type": "uint256"
			}
		],
		"name": "createRaindrop",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "emergencyRecoverToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			}
		],
		"name": "executeRaindrop",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feeRecipient",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			}
		],
		"name": "getParticipantCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "cursor",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "size",
				"type": "uint256"
			}
		],
		"name": "getParticipantsPaginated",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			}
		],
		"name": "getRaindropDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "host",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "scheduledTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "executed",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "cancelled",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "participantCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformFeeBps",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "raindropId",
				"type": "string"
			},
			{
				"internalType": "address[]",
				"name": "participantsToRemove",
				"type": "address[]"
			}
		],
		"name": "removeParticipants",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newRecipient",
				"type": "address"
			}
		],
		"name": "updateFeeRecipient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newFeeBps",
				"type": "uint256"
			}
		],
		"name": "updatePlatformFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as const; // Using 'as const' provides better type inference

// Minimal ABI for ERC20 approve function
export const erc20ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "_spender", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
] as const;