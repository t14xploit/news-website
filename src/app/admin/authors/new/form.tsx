"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { createAuthor } from "./actions";
import MultipleSelector, { Option } from "@/components/multiple-selector";
import {  useState } from "react";
import { searchArticles } from "./actions"; 

export default function CreateAuthorForm() {
  const [selectedArticles, setSelectedArticles] = useState<Option[]>([]);

  const [state, formAction, isPending] = useActionState(
    createAuthor.bind(null, selectedArticles.map((a) => a.value)), // pass article IDs
    {
      error: "",
      message: "",
    }
  );

  async function handleArticleSearch(query: string) {
    const articles = await searchArticles(query);
    return articles.map((a: { id: string; headline: string }) => ({
      value: a.id,
      label: a.headline,
    }));
  }

  return (
    <div className="max-w-xl mt-6  ">
      <form action={formAction}>
        {state.message && <p className="text-blue-600 mb-2">{state.message}</p>}
        {state.error && <p className="text-red-600 mb-2">{state.error}</p>}

        {/* Name */}
        <div className="space-y-2 my-4">
          <Label htmlFor="name">Name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter author name" required />
        </div>

        {/* Image URL */}
        <div className="space-y-2 my-4">
          <Label htmlFor="image">Image URL</Label>
          <Input type="text" name="image" id="image" placeholder="Image URL (optional)" />
        </div>

        {/* Articles Selector */}
        <div className="space-y-2 my-4">
          <Label>Articles</Label>
          <MultipleSelector
            value={selectedArticles}
            onChange={setSelectedArticles}
            onSearch={handleArticleSearch}
            placeholder="Select existed articles..."
            creatable={false} // DISALLOW creation
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
