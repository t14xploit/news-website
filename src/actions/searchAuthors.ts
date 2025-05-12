'use server';

import { prisma } from "@/lib/prisma";

export async function searchAuthors(formData: FormData) {
  const searchQuery = formData.get('search')?.toString() || '';

  if (!searchQuery.trim()) {
    return prisma.author.findMany({
      take: 20,
      include: {
        articles: { select: { id: true, headline: true } }, 
      },
    });
  }

  return prisma.author.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: 'insensitive', // Case-insensitive search
      },
    },
    take: 20,
    include: {
      articles: { select: { id: true, headline: true } }, 
    },
  });
}
