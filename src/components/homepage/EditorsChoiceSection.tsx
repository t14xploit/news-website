'use client';

import { Article, Category } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { GiNewspaper } from "react-icons/gi";

interface EditorsChoiceProps {
  articles: (Article & { categories: Category[] })[];
}

export default function EditorsChoiceSection({ articles }: EditorsChoiceProps) {
  if (articles.length < 2) return null;

  const [first, second, ...rest] = articles;
  const fallbackImageUrl =
  "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  // Function to format the metadata (time and categories)
  const renderMeta = (article: Article & { categories: Category[] }) => {
    const timeAgo = formatDistanceToNow(new Date(article.createdAt), { addSuffix: true });

    return (
      <div>
        <hr className="my-4 border-t-2 border-gray-300" />
        <p className="text-xs text-foreground mt-2 flex items-center gap-1">
          <span>{timeAgo}</span>
          <span className="mx-2">|</span>
          <span className="text-blue-600 font-medium">
            {article.categories.map((cat, index) => (
              <span key={cat.id}>
                 <Link
              key={cat.id}
              href={`/categories/${cat.title}`} 
              className="hover:underline"
            >

                {index > 0 && ", "}
                {cat.title}
            </Link>
              </span>
            ))}
          </span>
        </p>
      </div>
    );
  };

  return (
    <section className="my-4 space-y-6">
      <h2 className="text-4xl py-4 border-b font-bold  flex items-center gap-2">
      <GiNewspaper />
      Editor&apos;s Choice 
      </h2>

      {/* Top Section - First and Second Articles */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Part 1 - Main Article Image */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <Image
            src={first.image || fallbackImageUrl}
            alt={first.headline}
            width={500}
            height={350}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Right: Part 2 (Article 1 content) + Part 3 (Article 2 card) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Part 2: First Article Content */}
          <div>
            <Link href={`/articles/${first.id}`}>
              <h3 className="text-xl font-bold hover:underline">{first.headline}</h3>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-4">{first.summary}</p>
            {renderMeta(first)}
          </div>

          {/* Part 3: Second Article Card */}
          <div className="flex gap-4 border-t pt-4 lg:border-t-0 lg:p-0">
            <Image
              src={second.image || fallbackImageUrl}
              alt={second.headline}
              width={160}
              height={100}
              className="rounded-md object-cover w-[150px] h-[150px]"
            />
            <div>
              <Link href={`/articles/${second.id}`}>
                <h4 className="text-md font-semibold hover:underline">{second.headline}</h4>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2">{second.summary}</p>
              {renderMeta(second)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        {rest.slice(0, 5).map((article) => (
          <div key={article.id} className="border rounded-md p-4 hover:shadow-md transition">
            <Image
              src={article.image || fallbackImageUrl}
              alt={article.headline}
              width={300}
              height={180}
              className="w-full h-[200px] object-cover rounded mb-3"
            />
            <Link href={`/articles/${article.id}`}>
              <h4 className="text-md font-semibold hover:underline line-clamp-2">{article.headline}</h4>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
            {renderMeta(article)}
          </div>
        ))}
      </div>
    </section>
  );
}
