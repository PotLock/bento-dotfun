import { prisma } from './prisma';

export async function saveMarkdown({ title, content, htmlContent, userAddress }: { title: string; content: string; htmlContent: string; userAddress: string }) {
  try {
    const result = await prisma.markdown.create({
      data: {
        title,
        content,
        htmlContent,
        userAddress
      }
    });
    return result;
  } catch (error) {
    console.error('Error saving markdown:', error);
    throw error;
  }
}

export async function getMarkdowns() {
  try {
    const result = await prisma.markdown.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return result;
  } catch (error) {
    console.error('Error getting markdowns:', error);
    throw error;
  }
}

export async function getUserMarkdowns(userAddress: string) {
  try {
    const result = await prisma.markdown.findMany({
      where: {
        userAddress
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return result;
  } catch (error) {
    console.error('Error getting user markdowns:', error);
    throw error;
  }
}

export async function deleteMarkdown(id: string, userAddress: string) {
  try {
    const result = await prisma.markdown.delete({
      where: {
        id,
        userAddress
      }
    });
    return result;
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