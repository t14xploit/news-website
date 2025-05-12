'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchArticles } from "@/actions/search";
import SmallerArticleCard from "@/components/homepage/SmallerArticleCard";
import { Search } from "lucide-react"; // import the icon

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
  initialArticles?: Article[];
  showResults?: boolean;
}

export default function SearchForm({
  initialArticles = [],
  showResults = true,
}: ArticleSearchFormProps) {
  const [searchInput, setSearchInput] = useState("");
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!searchInput.trim()) return;

    if (!showResults) {
      router.push(`/articles?q=${encodeURIComponent(searchInput)}`);
      return;
    }

    setIsSearching(true);
    try {
      const formData = new FormData();
      formData.set("search", searchInput);
      const filteredArticles = await searchArticles(formData);
      setArticles(filteredArticles);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex flex-row gap-2 mt-2">
        <div className="relative w-full">
          {!showResults && (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          )}
          <Input
            type="text"
            name="search"
            placeholder="Search for an article..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isSearching}
            className={`${
              !showResults ? "pl-10" : "pl-4"
            } pr-3 py-2 rounded-lg border text-lg w-full`}
          />
        </div>

        {showResults && (
          <Button variant="outline" type="submit" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        )}
      </form>

      {showResults && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.length > 0 ? (
            articles.map((article) => (
              <SmallerArticleCard key={article.id} article={article} />
            ))
          ) : (
            <p>No articles found</p>
          )}
        </div>
      )}
    </>
  );
}
