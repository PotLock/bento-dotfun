'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWeb3Auth } from '@/context/web3auth-context';
import { useNear } from '@/context/near-context';
import { LoginModal } from './LoginModal';
import { useState } from 'react';
import { useContractInteraction } from '@/hooks/useContractInteraction';


const Navbar = () => {
  const { web3auth, loginWithProvider,accountId: web3authAccountId, logout: web3authLogout } = useWeb3Auth();
  const { isLoggedIn, currentAccountId } = useContractInteraction();
  const { wallet, signedAccountId } = useNear();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(currentAccountId)

  const handleLogout = async () => {
    if (web3auth?.connected) {
      await web3authLogout();
    }
    if (signedAccountId) {
      await wallet?.signOut();
    }
  };


  return (
    <nav className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mr-8">
              Web3 Markdown
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className={`text-gray-700 hover:text-blue-600 transition-colors ${
                  pathname === '/' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Home</span>
                </div>
              </Link>
              <Link
                href="/explore"
                className={`text-gray-700 hover:text-blue-600 transition-colors ${
                  pathname === '/explore' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Explore</span>
                </div>
              </Link>
              <Link
                href="/web3"
                className={`text-gray-700 hover:text-blue-600 transition-colors ${
                  pathname === '/web3' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>Web3</span>
                </div>
              </Link>
              <Link
                href="/docs"
                className={`text-gray-700 hover:text-blue-600 transition-colors ${
                  pathname === '/docs' ? 'font-semibold text-blue-600' : ''
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>Docs</span>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                  <Link href="/profile" className="text-sm text-gray-700 font-medium">
                    {currentAccountId?.slice(0, 6)}...{currentAccountId?.slice(-4)}
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
      <LoginModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLoginWithProvider={loginWithProvider}
        />
    </nav>
  );
};

export default Navbar;
