// src/components/CreateRaindropForm.tsx
import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, type Address } from 'viem';
import { raindropEscrowAddress, raindropEscrowABI, erc20ABI } from '../contracts';

const CreateRaindropForm = () => {
  // Form state
  const [raindropId, setRaindropId] = useState('');
  const [tokenAddress, setTokenAddress] = useState<Address | ''>('');
  const [totalAmount, setTotalAmount] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Wagmi hooks for contract interaction
  const { 
    data: approveHash, 
    writeContract: approve, 
    isPending: isApproving, 
    error: approveError 
  } = useWriteContract();

  const { 
    data: createHash, 
    writeContract: createRaindrop, 
    isPending: isCreating, 
    error: createError 
  } = useWriteContract();

  // Hooks to wait for transactions to be mined
  const { isSuccess: isApprovalSuccess, isLoading: isConfirmingApproval } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: isCreateSuccess, isLoading: isConfirmingCreate } = useWaitForTransactionReceipt({ hash: createHash });

  // --- DEBUG LOGS FOR APPROVAL LIFECYCLE ---
  useEffect(() => {
    console.log('--- Approval State Changed ---');
    console.log(`1. Is Pending (waiting for wallet confirmation):`, isApproving);
    console.log(`2. Transaction Hash:`, approveHash);
    if (approveHash) {
        console.log(`   Check on Etherscan: https://sepolia.etherscan.io/tx/${approveHash}`);
    }
    console.log(`3. Is Confirming (waiting for blockchain):`, isConfirmingApproval);
    console.log(`4. Is Success:`, isApprovalSuccess);
    if (approveError) {
      console.error(`Approval Error:`, approveError);
    }
    console.log('---------------------------------');
  }, [isApproving, approveHash, isConfirmingApproval, isApprovalSuccess, approveError]);
  
  // --- DEBUG LOGS FOR CREATE LIFECYCLE ---
  useEffect(() => {
    console.log('--- Create Raindrop State Changed ---');
    console.log(`1. Is Pending (waiting for wallet):`, isCreating);
    console.log(`2. Transaction Hash:`, createHash);
    if (createHash) {
        console.log(`   Check on Etherscan: https://sepolia.etherscan.io/tx/${createHash}`);
    }
    console.log(`3. Is Confirming (waiting for blockchain):`, isConfirmingCreate);
    console.log(`4. Is Success:`, isCreateSuccess);
    if (createError) {
      console.error(`Create Error:`, createError);
    }
    console.log('------------------------------------');
  }, [isCreating, createHash, isConfirmingCreate, isCreateSuccess, createError]);


  // Effect to trigger the createRaindrop transaction after the approval is successful
  useEffect(() => {
    if (isApprovalSuccess && raindropId && tokenAddress && totalAmount && scheduledTime) {
      // --- DEBUG LOG ---
      console.log('%cApproval successful! Now triggering createRaindrop transaction.', 'color: green; font-weight: bold;');

      const amountInWei = parseUnits(totalAmount, 18);
      const scheduledTimestamp = BigInt(Math.floor(new Date(scheduledTime).getTime() / 1000));
      
      createRaindrop({
        address: raindropEscrowAddress,
        abi: raindropEscrowABI,
        functionName: 'createRaindrop',
        args: [raindropId, tokenAddress, amountInWei, scheduledTimestamp],
      });
    }
  }, [isApprovalSuccess, createRaindrop, raindropId, tokenAddress, totalAmount, scheduledTime]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // --- DEBUG LOG ---
    console.log('%cForm Submitted! Requesting approval...', 'color: blue; font-weight: bold;');
    console.log({ raindropId, tokenAddress, totalAmount, scheduledTime, escrowContract: raindropEscrowAddress });

    if (!tokenAddress || !totalAmount) {
      console.error("Token address or amount is missing.");
      return;
    }

    const amountInWei = parseUnits(totalAmount, 18);
    approve({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'approve',
      args: [raindropEscrowAddress, amountInWei],
    });
  };
  
  const isLoading = isApproving || isConfirmingApproval || isCreating || isConfirmingCreate;
  const error = approveError || createError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label htmlFor="raindropId" className="block text-sm font-medium text-gray-300 mb-1">Raindrop ID</label>
        <input
          id="raindropId"
          type="text"
          value={raindropId}
          onChange={(e) => setRaindropId(e.target.value)}
          placeholder="e.g., 'q4-dev-payout'"
          className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          required
        />
      </div>
      <div>
        <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-300 mb-1">Token Address</label>
        <input
          id="tokenAddress"
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value as Address)}
          placeholder="0x..."
          className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          required
        />
      </div>
      <div>
        <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-300 mb-1">Total Amount</label>
        <input
          id="totalAmount"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="1000"
          className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          required
        />
      </div>
       <div>
        <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-300 mb-1">Scheduled Time</label>
        <input
          id="scheduledTime"
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500"
          required
        />
      </div>
      
      <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-md transition duration-300 disabled:opacity-50">
        {isApproving && 'Requesting Approval...'}
        {isConfirmingApproval && 'Confirming Approval...'}
        {isCreating && 'Creating Raindrop...'}
        {isConfirmingCreate && 'Finalizing Transaction...'}
        {!isLoading && 'Approve & Create Raindrop'}
      </button>

      {isCreateSuccess && <div className="text-green-400 text-center">Raindrop created successfully!</div>}
      {error && <div className="text-red-400 text-center">Error: {error.message}</div>}
    </form>
  );
};

export default CreateRaindropForm;