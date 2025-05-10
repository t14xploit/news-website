'use client';

import { Article } from "@/generated/prisma/client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns"; //npm install date-fns
import { Clock } from "lucide-react";

interface LatestNewsBlockProps {
  articles: Article[];
}

export default function LatestNewsBlock({ articles }: LatestNewsBlockProps) {
  return (
    <div className="p-4 border rounded-md shadow-sm space-y-4 overflow-y-auto w-full sm:w-3/4 md:w-full lg:w-full">
      <h2 className="text-2xl sm:text-xl md:text-2xl lg:text-2xl text-center font-semibold mb-4 text-red-600">
        Latest News
      </h2>

      {articles.map((article) => (
        <div key={article.id} className="border-b pb-3 last:border-b-0 space-y-4">
          <Link href={`/articles/${article.id}`}>
            <h3 className="text-md sm:text-sm md:text-md lg:text-md font-bold hover:underline mb-2">
              {article.headline}
            </h3>
          </Link>
          <p className="text-sm sm:text-xs md:text-sm lg:text-sm text-muted-foreground line-clamp-2">
            {article.summary}
          </p>
          <p className="text-muted-foreground mt-1 flex gap-2 text-xs sm:text-xs md:text-sm lg:text-sm">
            <Clock size={15} />
            {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
          </p>
        </div>
      ))}
    </div>
  );
}
