"use client";

import { Article } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  article: Article;
}

export default function MainArticleCard({ article }: ArticleCardProps) {
  const fallbackImageUrl =
    "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  return (
    <Card className="w-full">
      <CardHeader>
        <Link href={`/articles/${article.id}`}>
          <CardTitle className="text-2xl font-bold font-inika  hover:underline">
            {article.headline}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent>
        <Image
          src={article.image && article.image !== "" ? article.image : fallbackImageUrl}
          alt={article.headline}
          width={1200}
          height={600}
          className="w-full h-[300px] object-cover rounded-md mb-6"
        />
        <p className="text-md font-inika text-foreground">
          {article.content}
        </p>
      </CardContent>
    </Card>
  );
}
