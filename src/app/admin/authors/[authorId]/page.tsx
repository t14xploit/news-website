import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import DeleteAuthorButton from "@/components/admin/authors/DeleteAuthorButton";
type Params = Promise<{ 

    authorId: string; 

}>; 

 

type Props = { 

    params: Params; 

} 

export default async function AuthorPage(props:Props) {

    const params = await props.params; 

    const authorId = params.authorId; 
  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: {
      articles: {
        select: {
          id: true,
          headline: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!author) return notFound();

  return (
    <div className="space-y-6 max-w-2xl py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {author.picture ? (
            <Image
              src={author.picture}
              alt={author.name}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center font-bold text-xl">
              {author.name[0]}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold">{author.name}</h1>
            <p className="text-muted-foreground text-sm">
              ID: {author.id}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/admin/authors/${author.id}/edit`}>
            <Button variant="link" size="sm">
              <Edit className="w-4 h-4 mr-1" />
            
            </Button>
          </Link>

        

          <DeleteAuthorButton authorId={author.id} />
        </div>
      </div>

      {/* Articles List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Articles</h2>

        {author.articles.length === 0 ? (
          <p className="text-muted-foreground">No articles assigned.</p>
        ) : (
          <ul className="space-y-3">
            {author.articles.map((article) => (
              <li
                key={article.id}
                className="flex items-center justify-between "
              >
                <div>
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="font-medium hover:underline"
                  >
                    {article.headline}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
              
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
