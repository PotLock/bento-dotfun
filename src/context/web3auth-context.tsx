"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { CommonPrivateKeyProvider } from "@web3auth/base-provider";
import { WEB3AUTH_NETWORK, CHAIN_NAMESPACES, WALLET_ADAPTERS, IProvider } from "@web3auth/base";
import { connect, KeyPair, keyStores, utils, Near, Account } from "near-api-js";
import { getED25519Key } from "@web3auth/base-provider";

interface UserInfo {
  email?: string;
  name?: string;
  profileImage?: string;
  verifier?: string;
  verifierId?: string;
  typeOfLogin?: string;
  aggregateVerifier?: string;
}

interface Web3AuthContextType {
  web3auth: Web3AuthNoModal;
  provider: IProvider | null;
  accountId: string | null;
  nearConnection: Near | null;
  loginWithProvider: (loginProvider: string) => Promise<IProvider>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  createNearAccount: (accountId: string, publicKey: string) => Promise<void>;
}

const Web3AuthContext = createContext<Web3AuthContextType>({} as Web3AuthContextType);

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.OTHER,
  chainId: "0x4e454153",
  rpcTarget: "https://test.rpc.fastnear.com",
  displayName: "Near",
  blockExplorerUrl: "https://testnet.nearblocks.io/",
  ticker: "NEAR",
  tickerName: "NEAR",
  decimals: 24,
  isTestnet: true,
};

const privateKeyProvider = new CommonPrivateKeyProvider({
  config: { chainConfig: chainConfig },
});

if (!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID) {
  throw new Error('Please set NEXT_PUBLIC_WEB3AUTH_CLIENT_ID in your .env.local file');
}

const web3auth = new Web3AuthNoModal({
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "",
  web3AuthNetwork: 'sapphire_devnet',
  privateKeyProvider: privateKeyProvider,
});

const authAdapter = new AuthAdapter();
web3auth.configureAdapter(authAdapter);

interface Web3AuthProviderProps {
  children: ReactNode;
}

export function Web3AuthProvider({ children }: Web3AuthProviderProps) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [nearConnection, setNearConnection] = useState<Near | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupNearConnection = async (keyPair: KeyPair, newAccountId: string) => {
    try {
      const myKeyStore = new keyStores.InMemoryKeyStore();
      await myKeyStore.setKey("testnet", newAccountId, keyPair);
      
      const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };

      const connection = await connect(connectionConfig);
      setNearConnection(connection);
      return connection;
    } catch (error) {
      console.error("Error setting up NEAR connection:", error);
      throw error;
    }
  };

  const createNearAccount = async (accountId: string, publicKey: string) => {
    try {
      const response = await fetch('https://helper.testnet.near.org/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newAccountId: accountId,
          newAccountPublicKey: publicKey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create NEAR account');
      }

      const result = await response.json();
      console.log('NEAR account created:', result);
    } catch (error) {
      console.error('Error creating NEAR account:', error);
      throw error;
    }
  };

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

  const getNearCredentials = async (web3authProvider: IProvider) => {
    try {
      const privateKey = await web3authProvider.request({ method: "private_key" });
      const privateKeyEd25519 = getED25519Key(privateKey as string).sk.toString("hex");
      const privateKeyEd25519Buffer = Buffer.from(privateKeyEd25519, "hex");
      const bs58encode = utils.serialize.base_encode(privateKeyEd25519Buffer);
      const keyPair = KeyPair.fromString(`ed25519:${bs58encode}`);
      
      const publicKey = keyPair.getPublicKey();

      // Get user info from Web3Auth
      const userInfo = await web3auth.getUserInfo();
      if (!userInfo || !userInfo.email) {
        throw new Error("Could not get user email from Google login");
      }

      // Create account ID from email (remove @gmail.com and special characters)
      const emailUsername = userInfo.email.split('@')[0];
      // Replace any non-alphanumeric characters with underscore and convert to lowercase
      const sanitizedUsername = emailUsername.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const accountId = `${sanitizedUsername}_bento.testnet`;
      
      try {
        await createNearAccount(accountId, publicKey.toString());
        await createOrGetUser(accountId);
        localStorage.setItem('accountId', accountId);
      } catch (error) {
        // If account creation fails, try with a different name
        const timestamp = Date.now().toString().slice(-4);
        const accountId = `${sanitizedUsername}${timestamp}_bento.testnet`;
        await createNearAccount(accountId, publicKey.toString());
        await createOrGetUser(accountId);
        localStorage.setItem('accountId', accountId);
      }
      
      await setupNearConnection(keyPair, accountId);
      setAccountId(accountId);
      return { accountId };
    } catch (error) {
      console.error("Error getting NEAR credentials:", error);
      throw error;
    }
  };

  const loginWithProvider = async (loginProvider: string): Promise<IProvider> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: loginProvider,
      });
      
      if (!web3authProvider) {
        throw new Error("Failed to get Web3Auth provider");
      }

      setProvider(web3authProvider);
      await getNearCredentials(web3authProvider);
      return web3authProvider;
    } catch (error: any) {
      console.error(`Login with ${loginProvider} failed:`, error);
      setError(error.message || "Failed to login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (web3auth.connected) {
        await web3auth.logout();
        setProvider(null);
        setAccountId(null);
        setNearConnection(null);
      }
    } catch (error: any) {
      console.error("Logout failed:", error);
      setError(error.message || "Failed to logout");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await web3auth.init();
        console.log("Web3Auth initialized successfully");
      } catch (error: any) {
        console.error("Error initializing Web3Auth:", error);
        setError(error.message || "Failed to initialize");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  return (
    <Web3AuthContext.Provider value={{
      web3auth,
      provider,
      accountId,
      nearConnection,
      loginWithProvider,
      logout,
      isLoading,
      error,
      createNearAccount,
    }}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
} 