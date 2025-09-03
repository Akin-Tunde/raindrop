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
  const { data: approveHash, writeContract: approve, isPending: isApproving, error: approveError } = useWriteContract();
  const { data: createHash, writeContract: createRaindrop, isPending: isCreating, error: createError } = useWriteContract();

  // Hook to wait for the approval transaction to be mined
  const { isSuccess: isApprovalSuccess, isLoading: isConfirmingApproval } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: isCreateSuccess, isLoading: isConfirmingCreate } = useWaitForTransactionReceipt({ hash: createHash });

  // Effect to trigger the createRaindrop transaction after the approval is successful
  useEffect(() => {
    if (isApprovalSuccess) {
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
    if (!tokenAddress) return;

    const amountInWei = parseUnits(totalAmount, 18); // Assumes 18 decimals
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input fields remain the same as the previous example... */}
      {/* ... (omitted for brevity, you can copy from the previous TS example) */}
      
      <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-4 rounded-md transition duration-300 disabled:opacity-50">
        {isApproving && 'Requesting Approval...'}
        {isConfirmingApproval && 'Confirming Approval...'}
        {isCreating && 'Creating Raindrop...'}
        {isConfirmingCreate && 'Finalizing Transaction...'}
        {!isLoading && 'Approve & Create Raindrop'}
      </button>

      {isCreateSuccess && <div className="text-green-400">Raindrop created successfully!</div>}
      {error && <div className="text-red-400">Error: {error.message}</div>}
    </form>
  );
};

export default CreateRaindropForm;