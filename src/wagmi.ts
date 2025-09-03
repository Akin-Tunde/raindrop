// src/wagmi.ts
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia], // Add the chains you want to support
  connectors: [
    injected(), // For MetaMask and other browser wallets
    // You can add more connectors here like WalletConnect, Coinbase Wallet, etc.
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(), // Use a public RPC or your own
  },
});