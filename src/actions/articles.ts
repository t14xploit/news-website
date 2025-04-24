'use server';

import { prisma } from "@/lib/prisma";

export async function getArticlesForLandingPage() {
  // Main card + smaller cards articles
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      categories: true,
    },
    take: 9,
  });

  const [mainArticle, ...smallerArticles] = articles;

  // Editor's choice articles
  const editorsChoice = await prisma.article.findMany({
    where: {
      isEditorsChoice: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      categories: true,
    },
    take: 7, //   top 2 + bottom 5
  });

  return {
    mainArticle,
    smallerArticles,
    editorsChoice,
  };
}
