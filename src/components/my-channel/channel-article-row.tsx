import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Eye, MessageSquare, Bookmark } from "lucide-react";

interface Props {
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
    isPinned?: boolean;
  };
}

export default function ChannelArticleRow({ article }: Props) {
  return (
    <Link
      href={`/my-channel/articles/${article.id}`}
      className="flex items-start justify-between space-x-4 py-6 hover:bg-muted/50 transition-colors"
    >
      {/* Left: content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {article.isPinned && (
            <span className="px-2 py-0.5 text-xs font-medium uppercase bg-accent text-accent-foreground rounded">
              Pinned
            </span>
          )}
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={article.authorImageUrl || undefined}
              alt={article.authorName}
            />
            <AvatarFallback>{article.authorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{article.authorName}</span>
        </div>

        <h2 className="text-xl font-semibold leading-tight">
          {article.headline}
        </h2>

        <p className="text-base text-muted-foreground line-clamp-2">
          {article.summary}
        </p>

        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center space-x-1">
            <CalendarDays className="h-4 w-4" />
            <span>
              {article.publishDate.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {article.views != null && (
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{article.views}</span>
            </div>
          )}
          {article.commentCount != null && (
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{article.commentCount}</span>
            </div>
          )}
          <Bookmark className="h-4 w-4" />
        </div>
      </div>

      {/* Right: thumbnail */}
      {article.imageUrl && (
        <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-sm">
          <Image
            src={article.imageUrl}
            alt={article.headline}
            fill
            className="object-cover"
          />
        </div>
      )}
    </Link>
  );
}
