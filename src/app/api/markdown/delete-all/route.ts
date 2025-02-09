import { NextResponse } from 'next/server';
import { deleteAllMarkdowns } from '@/lib/db/schema';

export async function DELETE() {
  try {
    const result = await deleteAllMarkdowns();
    return NextResponse.json({ message: 'All markdowns deleted successfully', count: result.count });
  } catch (error) {
    console.error('Error in delete all API:', error);
    return NextResponse.json(
      { error: 'Failed to delete all markdowns' },
      { status: 500 }
    );
  }
} 