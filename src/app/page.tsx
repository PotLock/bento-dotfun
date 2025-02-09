'use client';

import { ReactElement } from 'react';
import Editor from '../components/Editor';
import { saveMarkdown, getMarkdowns, getUserMarkdowns, deleteMarkdown } from '@/lib/db/schema';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';

export default function Home(): ReactElement {
  const walletState = useWallet();
  
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        {walletState.error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
            {walletState.error}
          </div>
        )}
        {walletState.isConnected ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <Link href="/create" className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                Create New
              </Link>
              <Link href="/explore" className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700">
                Explore
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center p-8 bg-gray-100 rounded">
              Please connect your wallet to create markdowns
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 