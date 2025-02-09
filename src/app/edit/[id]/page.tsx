'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import { useWallet } from '@/context/WalletContext';
import toast, { Toaster } from 'react-hot-toast';

interface Markdown {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  userAddress: string;
  createdAt: Date;
  isShared: boolean;
}

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const walletState = useWallet();
  const [markdown, setMarkdown] = useState<Markdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(`/api/markdown/get?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch markdown');
        }
        const data = await response.json();
        
        // Check if the user is the owner
        const isOwner = data.userAddress === walletState.address;
        setIsOwner(isOwner);
        
        // If the markdown is not shared and the user is not the owner, redirect
        if (!data.isShared && !isOwner) {
          toast.error('This markdown is private');
          router.push('/explore');
          return;
        }
        
        setMarkdown(data);
      } catch (error) {
        console.error('Error fetching markdown:', error);
        toast.error('Failed to fetch markdown');
        router.push('/explore');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMarkdown();
    }
  }, [params.id, walletState.address]);

  const handleSave = async (title: string, content: string, htmlContent: string, isShared: boolean) => {
    if (!isOwner) {
      toast.error('You can only edit your own markdowns');
      return;
    }

    const savePromise = async () => {
      const response = await fetch('/api/markdown/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
          title,
          content,
          htmlContent: JSON.stringify(htmlContent),
          userAddress: walletState.address,
          isShared,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update markdown');
      }

      router.push('/explore');
    };

    toast.promise(
      savePromise(),
      {
        loading: 'Saving changes...',
        success: 'Changes saved successfully!',
        error: 'Failed to save changes',
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="container mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="min-h-screen p-8">
        <div className="container mx-auto">
          <div className="text-center">Markdown not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-center" />
      <div className="container mx-auto">
        {!isOwner && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md">
            You are viewing this markdown in read-only mode
          </div>
        )}
        {markdown && (
          <Editor
            initialValue={markdown.content}
            initialTitle={markdown.title}
            initialIsPrivate={!markdown.isShared}
            supportEmoji={true}
            walletAddress={walletState.address || undefined}
            onSave={handleSave}
            readOnly={!isOwner}
          />
        )}
      </div>
    </div>
  );
} 