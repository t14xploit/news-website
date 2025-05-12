import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

interface AuthorCardProps {
  author: {
    id: string;
    name: string;
    picture: string | null;
    articles: { id: string; headline: string }[];
  };
}

export const AuthorCard = ({ author }: AuthorCardProps) => {
  return (
    <div className="p-4 space-y-4 shadow-lg hover:shadow-xl transition-all">
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

      {/* List of Articles */}
      {author.articles.length > 0 && (
        <div>
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
        </div>
      )}
    </div>
  );
};
