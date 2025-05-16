"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchAuthors } from "@/actions/searchAuthors";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  picture: string | null;
  articles: { id: string; headline: string }[];
}

interface AuthorSearchFormProps {
  initialAuthors?: Author[];
  showResults?: boolean;
}

export default function AdminAuthorSearch({
  initialAuthors = [],
  showResults = true,
}: AuthorSearchFormProps) {
  const [searchInput, setSearchInput] = useState("");
  const [authors, setAuthors] = useState<Author[]>(initialAuthors);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    if (!showResults) {
      router.push(`/authors?q=${encodeURIComponent(searchInput)}`);
      return;
    }

    setIsSearching(true);
    try {
      const formData = new FormData();
      formData.set("search", searchInput);
      const filteredAuthors = await searchAuthors(formData);
      setAuthors(filteredAuthors);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search author..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={isSearching}
          className="text-sm"
        />
        <Button type="submit" variant="outline" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
           <Link
                  href="/admin/authors/new"
                >
                  <Button variant={"outline"}>
        
                  + Add Author
                  </Button>
                </Link>
          
      </form>

      {/* Results */}
      {showResults && (
        <div className="border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-left">
              <tr>
                <th className="p-2 font-semibold">Author</th>
                <th className="p-2 font-semibold">Articles</th>
                <th className="p-2 font-semibold">Actions</th>

              </tr>
            </thead>
            <tbody>
              {authors.length > 0 ? (
                authors.map((author) => (
                  <tr key={author.id} className="border-t hover:bg-muted">
                    <td className="p-2">
                      <Link
                        href={`/admin/authors/${author.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {author.name}
                      </Link>
                    </td>
                    <td className="p-2 space-y-1">
                      {author.articles.map((article) => (
                        <div key={article.id}>
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="hover:underline text-muted-foreground"
                          >
                            {article.headline}
                          </Link>
                        </div>
                      ))}
                    </td>
                       <td className="p-2 space-x-2">
                                      <Link
                                        href={`/admin/authors/${author.id}/edit`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        Edit
                                      </Link>
                                      <Link
                                        href={`/admin/authors/${author.id}`}
                                        className="text-muted-foreground hover:underline"
                                        target="_blank"
                                      >
                                        View
                                      </Link>
                                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-muted-foreground">
                    No authors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
