import { prisma } from './prisma';
import { Markdown, MarkdownWithUser } from '@/types/markdown-editor';

export async function saveMarkdown({ 
  title, 
  content, 
  htmlContent, 
  userAddress,
  isShared = false 
}: { 
  title: string; 
  content: string; 
  htmlContent: string; 
  userAddress: string;
  isShared?: boolean;
}): Promise<Markdown> {
  try {
    const result = await prisma.markdown.create({
      data: {
        title,
        content,
        htmlContent,
        userAddress,
        isShared
      },
      include: {
        user: true
      }
    });
    return result as unknown as Markdown;
  } catch (error) {
    console.error('Error saving markdown:', error);
    throw error;
  }
}

export async function getMarkdowns(): Promise<MarkdownWithUser[]> {
  try {
    const result = await prisma.markdown.findMany({
      where: {
        isShared: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });
    return result as unknown as MarkdownWithUser[];
  } catch (error) {
    console.error('Error getting markdowns:', error);
    throw error;
  }
}

export async function getUserMarkdowns(userAddress: string): Promise<MarkdownWithUser[]> {
  try {
    const result = await prisma.markdown.findMany({
      where: {
        userAddress
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });
    return result as unknown as MarkdownWithUser[];
  } catch (error) {
    console.error('Error getting user markdowns:', error);
    throw error;
  }
}

export async function getAllUserMarkdowns(userAddress: string): Promise<MarkdownWithUser[]> {
  try {
    const result = await prisma.markdown.findMany({
      where: {
        OR: [
          { userAddress },
          { isShared: true }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });
    return result as unknown as MarkdownWithUser[];
  } catch (error) {
    console.error('Error getting all user markdowns:', error);
    throw error;
  }
}

export async function deleteMarkdown(id: string, userAddress: string): Promise<Markdown> {
  try {
    const result = await prisma.markdown.delete({
      where: {
        id,
        userAddress
      },
      include: {
        user: true
      }
    });
    return result as unknown as Markdown;
  } catch (error) {
    console.error('Error deleting markdown:', error);
    throw error;
  }
}

export async function deleteAllMarkdowns() {
  try {
    const result = await prisma.markdown.deleteMany({});
    return result;
  } catch (error) {
    console.error('Error deleting all markdowns:', error);
    throw error;
  }
}

export async function toggleMarkdownShare(id: string, userAddress: string): Promise<Markdown> {
  try {
    const markdown = await prisma.markdown.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!markdown || markdown.userAddress !== userAddress) {
      throw new Error('Unauthorized or markdown not found');
    }

    const result = await prisma.markdown.update({
      where: { id },
      data: {
        isShared: !markdown.isShared
      },
      include: {
        user: true
      }
    });
    return result as unknown as Markdown;
  } catch (error) {
    console.error('Error toggling markdown share:', error);
    throw error;
  }
} 