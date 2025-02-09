import { NextResponse } from 'next/server';
import { getMarkdowns } from '@/lib/db/schema';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Get single markdown
      const markdown = await prisma.markdown.findUnique({
        where: { id }
      });

      if (!markdown) {
        return NextResponse.json(
          { error: 'Markdown not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(markdown);
    }

    // Get all markdowns
    const markdowns = await getMarkdowns();
    return NextResponse.json(markdowns);
  } catch (error) {
    console.error('Error getting markdowns:', error);
    return NextResponse.json(
      { error: 'Failed to get markdowns' },
      { status: 500 }
    );
  }
} 