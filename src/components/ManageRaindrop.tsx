// src/components/ManageRaindrop.tsx
import { useState, useEffect } from 'react'; // FIXED: Removed unused 'React' import
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { isAddress, formatUnits, type Address } from 'viem';
import { raindropEscrowAddress, raindropEscrowABI } from '../contracts';

const ManageRaindrop = () => {
    const [raindropId, setRaindropId] = useState<string>('');
    const [participants, setParticipants] = useState<string>('');
    
    const { data: details, isLoading: isLoadingDetails, error: readError, refetch } = useReadContract({
        address: raindropEscrowAddress,
        abi: raindropEscrowABI,
        functionName: 'getRaindropDetails',
        args: [raindropId],
        query: {
            enabled: !!raindropId,
        },
    });

    const { data: writeHash, writeContract, isPending, error: writeError } = useWriteContract();
    
    // FIXED: Replaced onSuccess callback with useEffect hook
    const { isLoading: isConfirming, isSuccess: isSuccessConfirm } = useWaitForTransactionReceipt({ 
        hash: writeHash,
    });

    useEffect(() => {
        if (isSuccessConfirm) {
            refetch(); // Refetch details after a successful transaction
        }
    }, [isSuccessConfirm, refetch]);


    const handleAddParticipants = () => {
        const addresses = participants.split(/[\s,]+/).filter(addr => isAddress(addr)) as Address[];
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
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-4 text-left">
                    <h3 className="text-lg font-bold text-center">Details for "{raindropId}"</h3>
                    <p><strong>Host:</strong> {details[0]}</p>
                    <p><strong>Amount:</strong> {formatUnits(details[2] as bigint, 18)} Tokens</p>
                    <p><strong>Participants:</strong> {details[6].toString()}</p>
                    <p><strong>Status:</strong> {details[4] ? 'Executed' : details[5] ? 'Cancelled' : 'Pending'}</p>

                    {/* ADDED: Missing participant form and buttons */}
                    <div className="space-y-4 pt-4 border-t border-gray-600">
                        <textarea
                            rows={4}
                            placeholder="Enter participant addresses, separated by commas or new lines"
                            value={participants}
                            onChange={(e) => setParticipants(e.target.value)}
                            className="w-full bg-gray-800 border-gray-600 rounded-md p-2"
                            disabled={isLoading || details[4] || details[5]} // Disable if executed or cancelled
                        />
                        <button onClick={handleAddParticipants} disabled={isLoading || details[4] || details[5]} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50">
                            {isLoading ? 'Processing...' : 'Add Participants'}
                        </button>
                        <button onClick={handleExecute} disabled={isLoading || details[4] || details[5]} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50">
                            {isLoading ? 'Processing...' : 'Execute Raindrop'}
                        </button>
                    </div>

                    {writeError && <p className="text-red-400 text-center">Error: {writeError.message}</p>}
                </div>
            )}
        </div>
    );
};

export default ManageRaindrop;