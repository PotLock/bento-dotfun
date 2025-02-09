'use client';

import { useCoinbaseWallet } from "@/hooks/useCoinbaseWallet";
import { ReactElement } from 'react';
import Editor from '../components/Editor';

export default function Home(): ReactElement {
  const { account, error, connect, disconnect, isConnected } = useCoinbaseWallet();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          {isConnected ? (
            <>
              <h1 className="text-2xl font-bold">
                Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
              </h1>
              <button
                onClick={disconnect}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Disconnect Wallet
              </button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Welcome to Markdown Editor</h1>
              <button
                onClick={connect}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            </>
          )}
        </div>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
        {isConnected ? (
          <Editor />
        ) : (
          <div className="text-center p-8 bg-gray-100 rounded">
            Please connect your wallet to use the editor
          </div>
        )}
      </div>
    </div>
  );
} 