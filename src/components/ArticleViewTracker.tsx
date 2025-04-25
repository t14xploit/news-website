'use client';

import { useEffect } from "react";
import { incrementArticleViews } from "@/actions/incrementArticleViews";

export default function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    incrementArticleViews(articleId);
  }, [articleId]);

  return null;
}
