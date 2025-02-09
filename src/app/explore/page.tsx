'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useWallet } from '@/context/WalletContext';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Markdown {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  userAddress: string;
  createdAt: Date;
}

const Explore = () => {
  const [markdowns, setMarkdowns] = useState<Markdown[]>([]);
  const [loading, setLoading] = useState(true);
  const walletState = useWallet();
  const router = useRouter();

  const handleDelete = async (id: string, userAddress: string) => {
    if (walletState.address !== userAddress) {
      toast.error('You can only delete your own markdowns');
      return;
    }

    if (!confirm('Are you sure you want to delete this markdown?')) {
      return;
    }

    try {
      const response = await fetch('/api/markdown/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, userAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete markdown');
      }

      setMarkdowns(markdowns.filter(md => md.id !== id));
      toast.success('Markdown deleted successfully');
    } catch (error) {
      console.error('Error deleting markdown:', error);
      toast.error('Failed to delete markdown');
    }
  };

  const handleEdit = (markdown: Markdown) => {
    if (walletState.address !== markdown.userAddress) {
      toast.error('You can only edit your own markdowns');
      return;
    }
    router.push(`/edit/${markdown.id}`);
  };

  useEffect(() => {
    const fetchMarkdowns = async () => {
      try {
        const response = await fetch('/api/markdown/get');
        if (!response.ok) {
          throw new Error('Failed to fetch markdowns');
        }
        const data = await response.json();
        console.log(data);
        setMarkdowns(data);
      } catch (error) {
        console.error('Error fetching markdowns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdowns();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="container mx-auto">
          <Navbar walletState={walletState} />
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-center" />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markdowns.map((markdown) => (
            <div
              key={markdown.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{markdown.title}</h2>
                  <div className="text-sm text-gray-500">
                    Created by: {markdown.userAddress.slice(0, 6)}...{markdown.userAddress.slice(-4)}
                  </div>
                </div>
                <div className="prose max-w-none">
                  <div
                    className="markdown-preview"
                    dangerouslySetInnerHTML={{
                      __html: JSON.parse(markdown.htmlContent)
                    }}
                  />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Created at: {new Date(markdown.createdAt).toLocaleDateString()}
                  </div>
                  {walletState.address === markdown.userAddress && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(markdown)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(markdown.id, markdown.userAddress)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
