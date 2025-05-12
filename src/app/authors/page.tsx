import { prisma } from "@/lib/prisma";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AllAuthorsPage = async () => {
  const authors = await prisma.author.findMany({
    include: {
      articles: {
        select: {
          id: true,
          headline: true,
        },
      },
    },
  });

  return (
    <div className="container space-y-6 my-6">
      <h1 className="text-2xl font-semibold">All Authors</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <Card key={author.id} className="p-4 space-y-4 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="space-y-2">
              {/* Author's Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  {author.picture ? (
                    <AvatarImage src={author.picture} alt={author.name} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback>{author.name?.[0]}</AvatarFallback>
                  )}
                </Avatar>
                <div className="text-left">
                  <h3 className="text-xl font-semibold">{author.name}</h3>
                  <Link href={`/authors/${author.id}`} className="text-sm text-blue-500 hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>
            </CardHeader>

            {/* List of Articles */}
            {author.articles.length > 0 && (
              <CardContent>
                <h4 className="text-lg font-semibold">Articles:</h4>
                <ul className="space-y-2">
                  {author.articles.map((article) => (
                    <li key={article.id}>
                      <Link href={`/articles/${article.id}`} className="text-sm text-primary hover:underline">
                        {article.headline}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllAuthorsPage;
