'use client';

import { Article, Category } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigRight } from "lucide-react";

interface EditorsChoiceProps {
  articles: (Article & { categories: Category[] })[];
}

export default function EditorsChoiceSection({ articles }: EditorsChoiceProps) {
  if (articles.length < 2) return null;

  const [first, second, ...rest] = articles;

  // Function to format the metadata (time and categories)
  const renderMeta = (article: Article & { categories: Category[] }) => {
    const timeAgo = formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });

    return (
      <div>
        <hr className="my-4 border-t-2 border-gray-300" />
        <p className="text-sm text-foreground mt-2 flex items-center gap-1">
          <span>{timeAgo}</span>
          <span className="mx-2">|</span>
          <span className="text-blue-600 font-medium">
            {article.categories.map((cat, index) => (
              <span key={cat.id}>
                {index > 0 && ", "}
                {cat.title}
              </span>
            ))}
          </span>
        </p>
      </div>
    );
  };

  return (
    <section className=" mt-6 space-y-6  pr-10 font-inika">
      <h2 className="flex items-center gap-2 text-4xl font-bold font-inika mb-6">
        Editor’s Choice
        <ArrowBigRight className="w-8 h-8 text-primary" />
      </h2>

      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Main Card */}
        <div className="flex-3 w-full lg:w-[60%] flex flex-col sm:flex-row gap-6">
          <Image
            src={first.image || "/placeholder.jpg"}
            alt={first.headline}
            width={500}
            height={350}
            className="w-[90%] sm:w-[50%] h-auto object-cover rounded-md"
          />
          <div className="flex flex-col justify-between">
            <div>
              <Link href={`/articles/${first.id}`}>
                <h3 className="text-2xl font-bold hover:underline">{first.headline}</h3>
              </Link>
              <p className="mt-3 text-base text-muted-foreground line-clamp-4">{first.summary}</p>
              {renderMeta(first)}
            </div>

            {/* Nested Second Card */}
            <div className="mt-8 flex gap-4 border-t pt-4">
              <Image
                src={second.image || "/placeholder.jpg"}
                alt={second.headline}
                width={160}
                height={100}
                className="rounded-md object-cover w-[200px] h-[200px]"
              />
              <div>
                <Link href={`/articles/${second.id}`}>
                  <h4 className="text-lg font-semibold hover:underline">{second.headline}</h4>
                </Link>
                <p className="text-base text-muted-foreground line-clamp-2">{second.summary}</p>
                {renderMeta(second)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {rest.slice(0, 5).map((article) => (
          <div key={article.id} className="border rounded-md p-4 hover:shadow-md transition">
            <Image
              src={article.image || "/placeholder.jpg"}
              alt={article.headline}
              width={300}
              height={180}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <Link href={`/articles/${article.id}`}>
              <h4 className="text-lg font-semibold hover:underline">{article.headline}</h4>
            </Link>
            <p className="text-base text-muted-foreground line-clamp-2">{article.summary}</p>
            {renderMeta(article)}
          </div>
        ))}
      </div>
    </section>
  );
}
