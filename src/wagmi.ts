// src/wagmi.ts
import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Securely access the API key from environment variables
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

if (!alchemyApiKey) {
  throw new Error("VITE_ALCHEMY_API_KEY is not set in your environment variables. Please add it to your .env.local file.");
}

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
  ],
  transports: {
    // Use your dedicated Alchemy RPC endpoint for mainnet
    [base.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`),
    // Use your dedicated Alchemy RPC endpoint for sepolia
   },
});