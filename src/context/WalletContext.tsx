'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useRef } from 'react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import toast from 'react-hot-toast';

export interface WalletContextType {
  wallet: CoinbaseWalletSDK | null;
  isConnected: boolean;
  error: string | null;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<CoinbaseWalletSDK | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const hasAttemptedReconnect = useRef(false);

  const createOrGetUser = async (userAddress: string) => {
    try {
      const response = await fetch(`/api/user?address=${userAddress}`);
      if (!response.ok) {
        throw new Error('Failed to create/get user');
      }
      const userData = await response.json();
      return userData;
    } catch (err) {
      console.error('Error creating/getting user:', err);
      throw err;
    }
  };

  const connect = async () => {
    const toastId = toast.loading('Connecting wallet...');
    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: 'Markdown Editor',
        appLogoUrl: '',
      });
      
      const ethereum = coinbaseWallet.makeWeb3Provider();
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      
      if (accounts && accounts.length > 0) {
        const userAddress = accounts[0];
        // Create or get user in the database
        await createOrGetUser(userAddress);
        
        setWallet(coinbaseWallet);
        setIsConnected(true);
        setAddress(userAddress);
        setError(null);

        // Store the connection in localStorage
        localStorage.setItem('walletAddress', userAddress);
        
        toast.success('Wallet connected successfully!', {
          id: toastId,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      setIsConnected(false);
      toast.error(errorMessage, {
        id: toastId,
      });
    }
  };

  const disconnect = () => {
    if (wallet) {
      setWallet(null);
      setIsConnected(false);
      setAddress(null);
      // Clear local storage
      localStorage.removeItem('walletconnect');
      localStorage.removeItem('walletAddress');
      toast.success('Wallet disconnected');
    }
  };

  useEffect(() => {
    // Try to reconnect if there's a previous session and hasn't attempted yet
    const checkConnection = async () => {
      if (hasAttemptedReconnect.current || isConnected) return;
      
      const savedAddress = localStorage.getItem('walletAddress');
      if (savedAddress) {
        hasAttemptedReconnect.current = true;
        const toastId = toast.loading('Reconnecting wallet...');
        try {
          const coinbaseWallet = new CoinbaseWalletSDK({
            appName: 'Markdown Editor',
            appLogoUrl: '',
          });
          
          const ethereum = coinbaseWallet.makeWeb3Provider();
          const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
          
          if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
            await createOrGetUser(accounts[0]);
            setWallet(coinbaseWallet);
            setIsConnected(true);
            setAddress(accounts[0]);
            setError(null);
            toast.success('Wallet reconnected!', {
              id: toastId,
            });
          } else {
            localStorage.removeItem('walletAddress');
            toast.dismiss(toastId);
          }
        } catch (err) {
          console.error('Error reconnecting:', err);
          localStorage.removeItem('walletAddress');
          toast.error('Failed to reconnect wallet', {
            id: toastId,
          });
        }
      }
    };
    
    checkConnection();
  }, []); // Empty dependency array since we use the ref to track state

  return (
    <WalletContext.Provider value={{ wallet, isConnected, error, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 
