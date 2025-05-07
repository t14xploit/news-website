'use server';

import { prisma } from "@/lib/prisma";

export async function searchArticles(formData: FormData) {
  const searchQuery = formData.get('search')?.toString() || '';

  if (!searchQuery.trim()) {
    return prisma.article.findMany({
      take: 20,
      include: {
        categories: true, 
      },
    });
  }

  return prisma.article.findMany({
    where: {
      headline: {
        contains: searchQuery,
        mode: 'insensitive',
      },
    },
    take: 20,
    include: {
      categories: true, 
    },
  });
}