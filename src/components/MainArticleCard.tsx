'use client';

import { Article } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";

interface ArticleCardProps {
  article: Article;
}

export default function MainArticleCard({ article }: ArticleCardProps) {
  const fallbackImageUrl =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  return (
    <Card className="w-full mb-6 sm:mb-8 md:mb-10">
      <CardHeader>
        <Link href={`/articles/${article.id}`}>
          <CardTitle className="text-2xl font-bold hover:underline">
            {article.headline}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent>
        <Image
          src={article.image || fallbackImageUrl}
          alt={article.headline}
          width={1200}
          height={600}
          className="w-full h-48 sm:h-64 md:h-80 lg:h-[300px] object-cover mb-4"
        />
        <p className="text-md font-inika text-foreground">{article.content}</p>
      </CardContent>
    </Card>
  );
}
