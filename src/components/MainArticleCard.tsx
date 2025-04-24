"use client";
import { Article } from "@/generated/prisma/client";
import { Card, CardContent } from "./ui/card";
import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  article: Article;
}

export default function MainArticleCard({ article }: ArticleCardProps) {
  // img placeholder
  const fallbackImageUrl = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

  return (
              <>
      <div>
        <Card className="max-w-lg">
          <CardHeader>
    <Link href={`/articles/${article.id}`}>
            <CardTitle>
            
                <CardContent className="mt-4 h-24 p-0">
                <h2 className="text-2xl text-left">{article.headline}</h2>
                <Image
                  src={article.image && article.image !== "" ? article.image : fallbackImageUrl}  // Use fallback image if no imageUrl is provided
                  alt={article.headline}
                  width={500}
                  height={500}
                  className="h-30 object-cover"
                />
                  <p className="text-lg">${article.summary}</p>

                </CardContent>
              </CardTitle>
            </Link>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
