'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import Navbar from '@/components/Navbar';
import { useWallet } from '@/context/WalletContext';
import toast, { Toaster } from 'react-hot-toast';

interface Markdown {
  id: string;
  title: string;
  content: string;
  htmlContent: string;
  userAddress: string;
  createdAt: Date;
}

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const walletState = useWallet();
  const [markdown, setMarkdown] = useState<Markdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(`/api/markdown/get?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch markdown');
        }
        const data = await response.json();
        
        if (data.userAddress !== walletState.address) {
          toast.error('You can only edit your own markdowns');
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

  const handleSave = async (title: string, content: string, htmlContent: string) => {
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
          htmlContent,
          userAddress: walletState.address,
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
          <Navbar walletState={walletState} />
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="min-h-screen p-8">
        <div className="container mx-auto">
          <Navbar walletState={walletState} />
          <div className="text-center">Markdown not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Toaster position="top-center" />
      <div className="container mx-auto">
        <Navbar walletState={walletState} />
        {markdown && (
          <Editor
            initialValue={markdown.content}
            initialTitle={markdown.title}
            supportEmoji={true}
            walletAddress={walletState.address || undefined}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
} 