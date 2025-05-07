'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchArticles } from "@/actions/search"; // The server-side function
import SmallerArticleCard from "@/components/SmallerArticleCard"; // Card component for rendering articles

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
  categories: { id: string; title: string }[];
}

interface ArticleSearchFormProps {
  initialArticles: Article[];
}

export default function SearchForm({ initialArticles }: ArticleSearchFormProps) {
  const [searchInput, setSearchInput] = useState("");
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const formData = new FormData();
      formData.set("search", searchInput);

      const filteredArticles = await searchArticles(formData); // Call server-side function
      setArticles(filteredArticles);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <form onSubmit={handleSearch} className="flex flex-row gap-2 mt-2">
          <Input
            type="text"
            name="search"
            placeholder="Search for an article..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isSearching}
          />
          <Button variant={"outline"} type="submit" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.length > 0 ? (
          articles.map((article) => (
            <SmallerArticleCard key={article.id} article={article} />
          ))
        ) : (
          <p>No articles found</p>
        )}
      </div>
    </>
  );
}