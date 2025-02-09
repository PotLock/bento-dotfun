import { NextResponse } from 'next/server';
import { saveMarkdown } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const { title, content, htmlContent, userAddress } = await request.json();

    if (!title || !content || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const savedMarkdown = await saveMarkdown({ title, content, htmlContent, userAddress });
    return NextResponse.json(savedMarkdown);
  } catch (error) {
    console.error('Error saving markdown:', error);
    return NextResponse.json(
      { error: 'Failed to save markdown' },
      { status: 500 }
    );
  }
} 