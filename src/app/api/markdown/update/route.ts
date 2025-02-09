import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function PUT(request: Request) {
  try {
    const { id, title, content, htmlContent, userAddress } = await request.json();

    if (!id || !title || !content || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await prisma.markdown.update({
      where: {
        id,
        userAddress
      },
      data: {
        title,
        content,
        htmlContent
      }
    });

    return NextResponse.json({ message: 'Markdown updated successfully', data: result });
  } catch (error) {
    console.error('Error updating markdown:', error);
    return NextResponse.json(
      { error: 'Failed to update markdown' },
      { status: 500 }
    );
  }
} 