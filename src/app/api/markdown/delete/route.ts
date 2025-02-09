import { NextResponse } from 'next/server';
import { deleteMarkdown } from '@/lib/db/schema';

export async function DELETE(request: Request) {
  try {
    const { id, userAddress } = await request.json();

    if (!id || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await deleteMarkdown(id, userAddress);
    return NextResponse.json({ message: 'Markdown deleted successfully', data: result });
  } catch (error) {
    console.error('Error deleting markdown:', error);
    return NextResponse.json(
      { error: 'Failed to delete markdown' },
      { status: 500 }
    );
  }
} 