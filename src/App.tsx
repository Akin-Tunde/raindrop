// src/App.tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import CreateRaindropForm from './components/CreateRaindropForm';
import ManageRaindrop from './components/ManageRaindrop';

function App() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold text-cyan-400">💧 Raindrop Escrow (Wagmi)</h1>
        {isConnected ? (
          <div className="flex items-center gap-4">
            <div className="bg-gray-700 text-sm text-white px-4 py-2 rounded-full">
              {`${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`}
            </div>
            <button onClick={() => disconnect()} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md"
              >
                Connect {connector.name}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="container mx-auto p-4 md:p-8">
        {isConnected ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">Create a New Raindrop</h2>
              <CreateRaindropForm />
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-3">Manage an Existing Raindrop</h2>
              <ManageRaindrop />
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-4xl font-light">Welcome to Raindrop</h2>
            <p className="text-xl mt-4 text-gray-400">Please connect your wallet to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;