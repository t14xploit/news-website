"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchArticles } from "@/actions/search";
import Link from "next/link";

interface Article {
  id: string;
  headline: string;
  createdAt: Date;
  categories: { id: string; title: string }[];
}

interface Props {
  initialArticles: Article[];
}

export default function AdminSearchForm({ initialArticles }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    try {
      const formData = new FormData();
      formData.set("search", searchInput);
      const results = await searchArticles(formData);
      setArticles(results);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search by headline"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full"
        />
        <Button type="submit" disabled={isSearching}>
          Search
        </Button>
      </form>

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left font-semibold">
            <tr>
              <th className="p-2">Headline</th>
              <th className="p-2">Categories</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{article.headline}</td>
                <td className="p-2">
                  {article.categories.map((c) => c.title).join(", ")}
                </td>
                <td className="p-2">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 space-x-2">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-muted hover:underline"
                    target="_blank"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-muted-foreground">
                  No articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
