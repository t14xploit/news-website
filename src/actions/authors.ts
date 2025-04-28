import { prisma } from "@/lib/prisma"; 

export async function getTopAuthorsWithMostViewedArticles() {
  // authors with their most viewed article
  const authors = await prisma.author.findMany({
    take: 3, // Top 3 authors
    orderBy: {
      articles: {
        _count: 'desc', // order by the number of articles each author has
      },
    },
    include: {
      articles: {
        orderBy: {
          views: 'desc', // order articles by views, descending
        },
        take: 1, // get only the most viewed article for each author
      },
    },
  });

  return authors.map((author) => ({
    name: author.name,
    id: author.id,
    picture: author.picture,
    headline: author.articles[0]?.headline ?? "No headline available",
    articleSummary: author.articles[0]?.summary ?? "No summary available",

    articleUrl: `/articles/${author.articles[0]?.id}`, // link to the article page
  }));
}
