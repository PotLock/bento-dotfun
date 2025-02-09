'use client';

import { useEffect, useState } from 'react';
import { getMarkdowns } from '@/lib/db/schema';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { MarkdownWithUser } from '@/types/markdown-editor';
import { formatDistanceToNow } from 'date-fns';

export default function ExplorePage() {
  const [markdowns, setMarkdowns] = useState<MarkdownWithUser[]>([]);
  const { address } = useWallet();

  useEffect(() => {
    const fetchMarkdowns = async () => {
      try {
        const response = await fetch('/api/markdown/get');
        if (!response.ok) {
          throw new Error('Failed to fetch markdowns');
        }
        const data = await response.json();
        setMarkdowns(data);
      } catch (error) {
        console.error('Error fetching markdowns:', error);
      }
    };

    fetchMarkdowns();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Explore Shared Markdowns
        </h1>
        <p className="text-gray-600 text-lg">
          Discover and read markdown documents shared by the community
        </p>
      </div>

      {markdowns.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-600 mb-2">No shared markdowns yet</p>
            <p className="text-gray-500 text-sm">Be the first to share your markdown document!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markdowns.map((markdown) => (
            <div
              key={markdown.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={markdown.user.image || '/default-avatar.png'}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-gray-100"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {markdown.user.address === address ? 'You' : 
                        `${markdown.user.address.slice(0, 6)}...${markdown.user.address.slice(-4)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(markdown.createdAt), { addSuffix: true })}
                    </p>
                  </div>
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
                <div className="flex justify-end mt-4">
                  <Link
                    href={`/edit/${markdown.id}`}
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <span>Read</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
