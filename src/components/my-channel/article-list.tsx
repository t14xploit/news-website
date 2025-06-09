"use client";

import { useState, useEffect } from "react";
import { getArticlesForOrganization } from "@/actions/my-channel/get-articles";
import ArticleCard from "@/components/my-channel/article-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  id: string;
  headline: string;
  summary: string;
  imageUrl?: string | null;
  authorName: string;
  authorImageUrl?: string | null;
  publishDate: Date;
  views?: number;
  organizationName?: string;
}

interface ArticleListProps {
  organizationId: string;
}

export default function ArticleList({ organizationId }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
      setIsLoading(true);
      try {
        const fetchedArticles = await getArticlesForOrganization(
          organizationId
        );
        setArticles(fetchedArticles);
        setError(null);
      } catch (error) {
        console.error("Failed to load articles:", error);
        setError("Failed to load articles. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadArticles();
  }, [organizationId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (articles.length === 0) {
    return <div>No articles found for this organization.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
