"use client";

import React, { useActionState, useTransition } from "react";
import { generateDraftArticle } from "@/actions/admin/generateDraftArticle";
import { saveGeneratedArticle } from "@/actions/admin/saveArticle";
import ReactMarkdown from "react-markdown";

export default function NewsGenerator() {
  const [state, generateAction, isGenerating] = useActionState(generateDraftArticle, null);

  const [isSaving, startSaving] = useTransition();
  const [saveStatus, setSaveStatus] = React.useState<null | string>(null);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">News Generator</h1>

      {/* Step 1: Generate Article */}
      {!state?.success && (
        <form action={generateAction} className="space-y-4">
          <div>
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              disabled={isGenerating}
              className="border p-1 ml-2"
            />
          </div>
          <button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Article"}
          </button>
          {state?.error && <p className="text-red-500">{state.error}</p>}
        </form>
      )}

      {/* Step 2: Preview + Save */}
      {state?.success && (
        <div className="mt-6 space-y-4">
          <h2 className="font-semibold">Preview:</h2>
          <div>
            <strong>Headline:</strong>
            <p>{state.headline}</p>
          </div>
          <div>
            <strong>Summary:</strong>
            <p>{state.summary}</p>
          </div>
          <div>
            <strong>Content:</strong>
            <div className="prose dark:prose-invert">
              <ReactMarkdown>

              {state.content}
              </ReactMarkdown>
              </div>
          </div>

          <button
            onClick={() =>
              startSaving(async () => {
                const formData = new FormData();
                formData.append("headline", state.headline!);
                formData.append("summary", state.summary!);
                formData.append("content", state.content!);
                const result = await saveGeneratedArticle(formData);
                if (result.success) {
                  setSaveStatus("Article saved!");
                } else {
                  setSaveStatus("Failed to save article.");
                }
              })
            }
            className="bg-green-600 text-white px-4 py-1 rounded"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Article"}
          </button>

          {saveStatus && <p className="mt-2">{saveStatus}</p>}
        </div>
      )}
    </div>
  );
}
