import { NextResponse } from 'next/server';
import { getAllUserMarkdowns } from '@/lib/db/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }

    const markdowns = await getAllUserMarkdowns(userAddress);
    return NextResponse.json(markdowns);
  } catch (error) {
    console.error('Error getting all markdowns:', error);
    return NextResponse.json(
      { error: 'Failed to get markdowns' },
      { status: 500 }
    );
  }
} 