// src/components/SearchForm.tsx

'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // To navigate and update the URL
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const router = useRouter(); // Get the router to update the URL on search

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from submitting the default way
    if (query) {
      router.push(`/articles?q=${query}`); // Navigate to the articles page with the search query in the URL
    }
  };
  
  useEffect(() => {
    if (query) {
      const timeoutId = setTimeout(() => {
        router.push(`/articles?q=${query}`);
      }, 500); 
      return () => clearTimeout(timeoutId); 
    }
  }, [query, router]);

  return (
    <form onSubmit={handleSubmit} className="mb-1 w-full max-w-[12rem] mr-auto">
        <div className="relative font-inika">
        <Search
         className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-neutral-900"
        />
      <Input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query state
       className="border border-neutral-300 rounded-lg pl-7 pr-2 py-0.5 w-full text-sm bg-white placeholder:text-neutral-500 transition"
        />

        </div>
    </form>
  );
}
