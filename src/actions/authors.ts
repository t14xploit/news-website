import { prisma } from "@/lib/prisma";

// Utility function to shuffle an array (Fisher-Yates Shuffle)
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export async function getTopAuthorsWithRandomArticles() {
  // Step 1: Fetch authors with ALL their articles
  const authors = await prisma.author.findMany({
    orderBy: {
      articles: {
        _count: 'desc', // top authors by article count
      },
    },
    take: 10, // get top 10 authors
    include: {
      articles: {
        select: {
          id: true,
          headline: true,
          summary: true,
          views: true,
        },
      },
    },
  });

  // Step 2: Collect random articles from each author
  const uniqueAuthorsWithArticles = [];

  // Shuffle the authors list to ensure randomness
  shuffleArray(authors);

  // Step 3: Iterate through authors and pick a random article for each
  for (const author of authors) {
    // Shuffle the author's articles to pick one randomly
    shuffleArray(author.articles);

    // Pick the first article after shuffle
    const article = author.articles[0];

    // Add the article with author info to the result
    uniqueAuthorsWithArticles.push({
      name: author.name,
      id: author.id,
      picture: author.picture,
      headline: article.headline ?? "No headline available",
      articleSummary: article.summary ?? "No summary available",
      articleUrl: `/articles/${article.id}`,
    });

    // Stop after 3 unique authors with articles
    if (uniqueAuthorsWithArticles.length === 3) break;
  }

  return uniqueAuthorsWithArticles;
}
