'use client'; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Search } from "lucide-react"; 
import { searchAuthors } from "@/actions/searchAuthors";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; 
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

export default function SearchForm({
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
      // Call searchAuthors server-side action to get filtered authors
      const filteredAuthors = await searchAuthors(formData);
      setAuthors(filteredAuthors);
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
            placeholder="Search for an author..."
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
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.length > 0 ? (
            authors.map((author) => (
              <div
                key={author.id}
                className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Avatar and Author Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <Link href={`/authors/${author.id}`} className="flex items-center space-x-2">
                    <Avatar className="w-12 h-12">
                      {author.picture ? (
                        <AvatarImage
                          src={author.picture}
                          alt={author.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="w-full h-full">
                          {author.name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="text-lg font-semibold">{author.name}</h3>
                  </Link>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-lg">Articles:</h4>
                  <ul className="mt-2 space-y-2">
                    {author.articles.map((article) => (
                      <li key={article.id} className="text-sm hover:underline">
                        <Link href={`/articles/${article.id}`}>{article.headline}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No authors found</p>
          )}
        </div>
      )}
    </>
  );
}
