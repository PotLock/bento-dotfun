'use client';

import { useWallet } from "@/context/WalletContext";
import Navbar from "./Navbar";

const LayoutCustom = ({ children }: { children: React.ReactNode }) => {
  const walletState = useWallet();
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <Navbar walletState={walletState} />
        {children}
        </div>
    </div>
  );
};

export default LayoutCustom;