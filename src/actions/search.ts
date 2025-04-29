import { prisma } from "@/lib/prisma";

export async function searchArticles(query: string) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        headline: {
          contains: query,
          mode: 'insensitive', 
        },
      },
      take: 10, 
    });
    return articles;
  } catch (error) {
    console.error('Error searching articles:', error);
    throw new Error('Error searching articles');
  }
}
