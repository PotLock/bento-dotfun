import { NextResponse } from 'next/server';
import { toggleMarkdownShare } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const { id, userAddress } = await request.json();

    if (!id || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedMarkdown = await toggleMarkdownShare(id, userAddress);
    return NextResponse.json(updatedMarkdown);
  } catch (error) {
    console.error('Error toggling markdown share:', error);
    return NextResponse.json(
      { error: 'Failed to toggle markdown share' },
      { status: 500 }
    );
  }
} 