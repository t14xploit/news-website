import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { GiNewspaper } from "react-icons/gi";

type ExpertInsightsSectionProps = {
  authors: {
    id: string; // ID to identify author
    name: string;
    picture?: string | null;
    headline: string;
    articleUrl: string;
    articleSummary: string;
  }[];
};

const ExpertInsightsSection: FC<ExpertInsightsSectionProps> = ({ authors }) => {
  return (
    <section className=" bg-background text-foreground">
      <h2 className="text-4xl border-b py-4 font-bold my-6 flex items-center gap-2">
       <GiNewspaper/> Expert Insights 
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {authors.map((author, index) => (
          <Card key={index} className="flex  bg-background flex-col p-6 ">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                {author.picture ? (
                  <AvatarImage src={author.picture} alt={author.name} className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="w-full h-full">{author.name?.[0]}</AvatarFallback>
                )}
              </Avatar>
              {/* Author's Name as a Link */}
              <Link href={`/authors/${author.id}`} className="text-lg font-semibold text-foreground hover:underline">
                {author.name}
              </Link>
            </div>

            <Link href={author.articleUrl} className="text-lg font-semibold text-primary hover:underline line-clamp-2">
              {author.headline}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-3">{author.articleSummary}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ExpertInsightsSection;
