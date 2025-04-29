// src/components/SearchForm.tsx

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // To navigate and update the URL
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const router = useRouter(); // Get the router to update the URL on search

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from submitting the default way
    if (query) {
      router.push(`/articles?q=${query}`); // Navigate to the articles page with the search query in the URL
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 ">
        <div className='flex gap-4 font-inika'>

      <Input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query state
        className="border p-2 w-[75%]"
        />
      <Button className='cursor-pointer' variant="outline" type="submit">
        Search
      </Button>
        </div>
    </form>
  );
}
