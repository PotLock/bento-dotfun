'use client';

import Editor from "@/components/Editor";
import Navbar from "@/components/Navbar";
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Create = () => {
  const walletState = useWallet();
  const router = useRouter();

  const handleSave = async (title: string, content: string, htmlContent: string) => {
    if (!walletState.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const response = await fetch('/api/markdown/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          htmlContent,
          userAddress: walletState.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save markdown');
      }

      toast.success('Markdown saved successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error saving markdown:', error);
      toast.error('Failed to save markdown');
    }
  };

  return (
    <div className="container mx-auto min-h-screen p-8">
      <Editor 
        walletAddress={walletState.address || undefined} 
        onSave={handleSave}
      />
    </div>
  );
};

export default Create;
