'use server';

import { prisma } from "@/lib/prisma"; 

export async function getArticlesForLandingPage() {
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      categories: true,
    },
    take: 9, // get one for the main, 8 for smaller
  });

  if (articles.length === 0) {
    return {
      mainArticle: null,
      smallerArticles: [],
    };
  }

  const [mainArticle, ...smallerArticles] = articles;

  return {
    mainArticle,
    smallerArticles,
  };
}
