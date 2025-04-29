// src/app/articles/page.tsx

import { prisma } from '@/lib/prisma';
import SearchForm from '@/components/SearchForm'; 
import SmallerArticleCard from '@/components/SmallerArticleCard'; 

interface Article {
  id: string;
  headline: string;
  summary: string;
  content: string;
  image: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  isEditorsChoice: boolean;
  categories: { id: string; title: string }[]; //  category info for the card
}

// this function is executed on the server side
const fetchArticles = async (query: string): Promise<Article[]> => {
  try {

    const articles = await prisma.article.findMany({
      where: {
        headline: {
          contains: query, //  the 'headline' field for the query
          mode: 'insensitive', 
        },
      },
      include: {
        categories: true, // include categories of each article
      },
      take: 10, 
    });

    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

export default async function ArticlesPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ''; // Get the search query from the URL (if any)
  const articles = await fetchArticles(query); 

  return (
    <div className="p-4 font-inika">
      <SearchForm /> 
      
      {/*  search results */}
      <h1 className="text-xl font-bold mb-4">Search Results</h1>
      
      {articles.length === 0 ? (
        <p>No articles found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {articles.map((article) => (
            <SmallerArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
