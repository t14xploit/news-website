"use client";

import { generateArticle } from "@/actions/admin/ai-generate-news";
import { useActionState } from "react";

export default function NewsGenerator() {
  const [state, formAction, isPending] = useActionState(generateArticle, null);

  const handleClear = () => {
    window.location.reload();
  };

  return (
    <div>
      <h1>News Generator</h1>
      <form action={formAction} className="mt-5">
        <div>
          <label htmlFor="subject">Subject: </label>
          <input type="text" id="subject" name="subject" disabled={isPending} />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={isPending}>
            {isPending ? "Generating..." : "Generate Article"}
          </button>
          <button
            onClick={() => {
              handleClear();
            }}
          >
            Clear
          </button>
        </div>
      </form>
      {state && !state.success && state.error && (
        <div className="mt-3">Error: {state.error}</div>
      )}
      {state && state.success && state.article && (
        <div className="mt-3 whitespace-pre-wrap">{state.article}</div>
      )}
    </div>
  );
}