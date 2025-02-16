'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useNear } from '@/context/near-context';
import { MarkdownWithUser } from '@/types/markdown-editor';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import LoginButton from "@/components/LoginButton";
import { useContractInteraction } from '@/hooks/useContractInteraction';

export default function HomePage() {
  const [markdowns, setMarkdowns] = useState<MarkdownWithUser[]>([]);
  const { currentAccountId, setSocial } = useContractInteraction();

  console.log(currentAccountId)

  useEffect(() => {
    const fetchMarkdowns = async () => {
      if (!currentAccountId) return;
      
      try {
        const response = await fetch(`/api/markdown/get-by-address?userAddress=${currentAccountId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch markdowns');
        }
        const data = await response.json();
        console.log(data);
        setMarkdowns(data);
      } catch (error) {
        console.error('Error fetching markdowns:', error);
        toast.error('Failed to fetch markdowns');
      }
    };

    fetchMarkdowns();
  }, [currentAccountId]);

  const handleToggleShare = async (id: string) => {
    try {
      const response = await fetch('/api/markdown/toggle-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, userAddress: currentAccountId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle share status');
      }

      const updatedMarkdown = await response.json();
      setMarkdowns(markdowns.map(md => 
        md.id === updatedMarkdown.id ? { ...md, isShared: updatedMarkdown.isShared } : md
      ));
      
      toast.success(updatedMarkdown.isShared ? 'Markdown is now shared' : 'Markdown is now private');
    } catch (error) {
      console.error('Error toggling share status:', error);
      toast.error('Failed to update sharing status');
    }
  };

  if (!currentAccountId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Decentralized Markdown Editor
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect your wallet to start creating and sharing your markdown documents in Web3 style
          </p>
          <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg">
            <img src="/connect-wallet.svg" alt="Connect Wallet" className="w-48 h-48 mx-auto mb-6" />
            <p className="text-gray-600">Please connect your wallet to access the editor</p>
          </div>
          {/* <LoginButton /> */}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Your Markdowns
          </h1>
          <p className="text-gray-600 mt-2">Create, edit, and share your markdown documents</p>
        </div>
        <Link
          href="/create"
          className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {markdowns.map((markdown) => (
          <div
            key={markdown.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={markdown.user.image || '/default-avatar.png'}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-gray-100"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {markdown.user.address === currentAccountId ? 'You' : 
                        `${markdown.user.address.slice(0, 6)}...${markdown.user.address.slice(-4)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(markdown.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {markdown.user.address === currentAccountId && (
                  <button
                    onClick={() => handleToggleShare(markdown.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      markdown.isShared
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {markdown.isShared ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0l-3 3m3-3l3 3m-3-6v-2m0 0l-3-3m3 3l3-3" />
                        )}
                      </svg>
                      <span>{markdown.isShared ? 'Shared' : 'Private'}</span>
                    </div>
                  </button>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {markdown.title}
              </h2>
              <div 
                className="prose prose-sm max-h-72 overflow-hidden text-gray-600 mb-4"
                dangerouslySetInnerHTML={{ 
                  __html: markdown.htmlContent
                }}
              />
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this document?')) {
                      try {
                        const response = await fetch('/api/markdown/delete', {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ id: markdown.id, userAddress: currentAccountId }),
                        });

                        if (!response.ok) {
                          throw new Error('Failed to delete markdown');
                        }

                        setMarkdowns(markdowns.filter(md => md.id !== markdown.id));
                        toast.success('Document deleted successfully');
                      } catch (error) {
                        console.error('Error deleting markdown:', error);
                        toast.error('Failed to delete document');
                      }
                    }
                  }}
                  className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete</span>
                </button>
                <Link
                  href={`/edit/${markdown.id}`}
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <span>{markdown.user.address === currentAccountId ? 'Edit' : 'Read'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 