// src/components/ManageRaindrop.tsx
import React, { useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { isAddress, formatUnits } from 'viem';
import { raindropEscrowAddress, raindropEscrowABI } from '../contracts';

const ManageRaindrop = () => {
    const [raindropId, setRaindropId] = useState<string>('');
    const [participants, setParticipants] = useState<string>('');
    
    // Wagmi hook to read contract data. It will automatically refetch if raindropId changes.
    const { data: details, isLoading: isLoadingDetails, error: readError, refetch } = useReadContract({
        address: raindropEscrowAddress,
        abi: raindropEscrowABI,
        functionName: 'getRaindropDetails',
        args: [raindropId],
        query: {
            enabled: !!raindropId, // Only run the query if raindropId is not empty
        },
    });

    const { data: writeHash, writeContract, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
        hash: writeHash,
        onSuccess: () => refetch(), // Refetch details after a successful transaction
    });

    const handleAddParticipants = () => {
        const addresses = participants.split(/[\s,]+/).filter(addr => isAddress(addr));
        if (addresses.length === 0) return alert("No valid addresses provided.");
        writeContract({
            address: raindropEscrowAddress,
            abi: raindropEscrowABI,
            functionName: 'addParticipants',
            args: [raindropId, addresses],
        });
    };

    const handleExecute = () => {
        writeContract({
            address: raindropEscrowAddress,
            abi: raindropEscrowABI,
            functionName: 'executeRaindrop',
            args: [raindropId],
        });
    };
    
    const isLoading = isPending || isConfirming;

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Raindrop ID to manage"
                    value={raindropId}
                    onChange={(e) => setRaindropId(e.target.value)}
                    className="flex-grow bg-gray-700 border-gray-600 rounded-md p-2"
                />
            </div>

            {isLoadingDetails && <p>Loading details...</p>}
            {readError && <p className="text-red-400">Error fetching details: {readError.message}</p>}

            {details && (
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-bold">Details for "{raindropId}"</h3>
                    <p><strong>Host:</strong> {details[0]}</p>
                    <p><strong>Amount:</strong> {formatUnits(details[2] as bigint, 18)} Tokens</p>
                    <p><strong>Participants:</strong> {details[6].toString()}</p>
                    <p><strong>Status:</strong> {details[4] ? 'Executed' : details[5] ? 'Cancelled' : 'Pending'}</p>

                    {/* Action buttons and participant form (omitted for brevity) */}
                    {/* ... build the forms and buttons here ... */}
                    {/* ... call handleAddParticipants() and handleExecute() ... */}
                    
                    <button onClick={handleExecute} disabled={isLoading} className="w-full bg-green-600 ...">
                        {isLoading ? 'Processing...' : 'Execute Raindrop'}
                    </button>
                    {writeError && <p className="text-red-400">Error: {writeError.message}</p>}
                </div>
            )}
        </div>
    );
};

export default ManageRaindrop;