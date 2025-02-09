import { WalletContextType } from '@/context/WalletContext';
import Link from 'next/link';

interface NavbarProps {
  walletState: WalletContextType;
}

export default function Navbar({ walletState }: NavbarProps) {
  const { isConnected, address, connect, disconnect } = walletState;

  return (
    <nav className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
      <Link href="/" className="text-2xl font-bold text-gray-800">Markdown Editor</Link>
      <div>
        {isConnected ? (
          <div className="flex items-center gap-4">
            <Link 
              href="/profile" 
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Link>
            <button
              onClick={disconnect}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connect}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}
