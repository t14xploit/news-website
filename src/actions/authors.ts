import { prisma } from "@/lib/prisma";

//  shuffle an array (Fisher-Yates Shuffle)
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
  const selectedAuthors = new Set<string>(); // Set to track authors we've already picked

  // Shuffle the authors list to ensure randomness
  shuffleArray(authors);

  // Step 3: Iterate through authors and pick a random article for each
  for (const author of authors) {
    if (selectedAuthors.has(author.id)) {
      continue; // Skip this author if we've already selected one of their articles
    }

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

    // Mark this author as selected
    selectedAuthors.add(author.id);

    // Stop after 3 unique authors with articles
    if (uniqueAuthorsWithArticles.length === 3) break;
  }

  return uniqueAuthorsWithArticles;
}
