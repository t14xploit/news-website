import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Eye, MessageSquare, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ArticleCardProps {
  article: {
    id: string;
    headline: string;
    summary: string;
    imageUrl?: string | null;
    authorName: string;
    authorImageUrl?: string | null;
    publishDate: Date;
    views?: number;
    commentCount?: number;
    organizationName?: string;
  };
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link href={`/my-channel/articles/${article.id}`}>
      <Card
        className={cn(
          "rounded-sm overflow-hidden",
          "border-none bg-transparent shadow-none focus:outline-none focus:ring-0",
          " max-w-md w-full",
          "p-0 m-0 mt-0",
          "grid grid-rows-[auto_1fr_auto] gap-0",
          "overflow-hidden hover:scale-[1.02] transition-transform duration-300"
        )}
      >
        {article.imageUrl && (
          <div className="rounded-sm relative aspect-video overflow-hidden ">
            <Image
              src={article.imageUrl}
              alt={article.headline}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardContent className="pt-6 px-0 pb-6 space-y-4">
          <div className="flex items-center mb-4 space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={article.authorImageUrl || undefined}
                alt={article.authorName}
              />
              <AvatarFallback>{article.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium">{article.authorName}</span>
              {article.organizationName && (
                <p className="text-xs text-muted-foreground">
                  {article.organizationName}
                </p>
              )}
            </div>
          </div>

          <div>
            <CardTitle className="text-2xl font-bold leading-tight text-foreground mb-3">
              {article.headline}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground line-clamp-2">
              {article.summary}
            </CardDescription>
          </div>
        </CardContent>

        <CardFooter className="p-0 border-t border-border flex justify-between items-center text-muted-foreground">
          <div className="flex items-center text-sm">
            <CalendarDays className="mr-2 h-4 w-4" />
            {article.publishDate.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center space-x-4">
            {article.views !== undefined && (
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{article.views}</span>
              </div>
            )}
            {article.commentCount !== undefined && (
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{article.commentCount}</span>
              </div>
            )}
            <Bookmark className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ArticleCard;
