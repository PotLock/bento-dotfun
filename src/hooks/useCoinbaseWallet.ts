import { useEffect, useState } from 'react';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const APP_NAME = 'Markdown Editor';
const APP_LOGO_URL = 'https://your-app-logo.com/logo.png';
const BASE_MAINNET_CHAIN_ID = 8453;
const BASE_SEPOLIA_CHAIN_ID = 84532;

export function useCoinbaseWallet() {
  const [wallet, setWallet] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Initialize Coinbase Wallet SDK with Base chain support
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL
      });

      // Initialize a Web3 Provider
      const provider = coinbaseWallet.makeWeb3Provider();
      setWallet(provider);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const connect = async () => {
    if (!wallet) {
      setError('Wallet not initialized');
      return;
    }

    try {
      const accounts = await wallet.request({
        method: 'eth_requestAccounts'
      });
      
      // Switch to Base Sepolia network
      await wallet.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}` }]
      });
      
      setAccount(accounts[0]);
      setError(null);
    } catch (err: any) {
      if (err.code === 4902) {
        // Chain not added, add it
        try {
          await wallet.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}`,
              chainName: 'Base Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org']
            }]
          });
          // Try connecting again
          await connect();
        } catch (addError: any) {
          setError(addError.message);
        }
      } else {
        setError(err.message);
      }
    }
  };

  const disconnect = () => {
    if (wallet) {
      wallet.disconnect();
    }
    setAccount(null);
    setError(null);
  };

  return {
    wallet,
    address: account,
    error,
    connect,
    disconnect,
    isConnected: !!account
  };
} 