import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigRight } from "lucide-react";
import Link from "next/link";

type Params = Promise<{
  id: string;
}>;

interface AuthorPageProps {
  params: Params;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  // Wait for params to resolve
  const resolvedParams = await params;
  const authorId = resolvedParams.id;

  // Fetch the author from the database
  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: {
      articles: {
        orderBy: {
          views: "desc",
        },
        include: {
          authors: true,
        },
      },
    },
  });

  if (!author) {
    return <div>Author not found.</div>;
  }

  return (
    <div className="container space-y-6 mb-6">
      {/* Avatar and Author Info */}
      <div className="mt-6 flex items-center space-x-4">
        <Avatar className="w-35 h-35">
          {author.picture ? (
            <AvatarImage
              src={author.picture}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <AvatarFallback className="w-full h-full">
              {author.name?.[0]}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-left">
          <h1 className="text-xl font-semibold">{author.name}</h1>
        </div>
      </div>

      {/* Articles Section */}
      <h2 className="text-lg font-semibold flex items-center">
        Author&apos;s Articles <ArrowBigRight className="w-6 h-6 text-foreground" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {author.articles.map((article) => (
          <Card
            key={article.id}
            className="p-4 space-y-4 shadow-lg hover:shadow-xl transition-all"
          >
            <CardHeader>
              <Link href={`/articles/${article.id}`}>
                <h3 className="text-xl font-bold line-clamp-1 hover:underline">
                  {article.headline}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(article.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">{article.summary}</p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Written by:</p>
                <div className="flex flex-wrap space-x-2">
  {article.authors.map((author, index) => (
    <span key={author.id} className="text-sm text-primary">
      <Link href={`/authors/${author.id}`} className="hover:underline">
        {author.name}
      </Link>
      {index < article.authors.length - 1 ? ", " : ""}
    </span>
  ))}
</div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
