import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";

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
    <section className="py-10 bg-background text-foreground">
  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Expert Insights <ArrowBigRight className="w-6 h-6 text-primary" />
      </h2>      <div className="flex justify-center gap-10">
        {authors.map((author, index) => (
          <Card key={index} className="w-[300px] flex flex-col p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                {author.picture ? (
                  <AvatarImage src={author.picture} alt={author.name} className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="w-full h-full">{author.name?.[0]}</AvatarFallback>
                )}
              </Avatar>
              {/* author's Name as a Link
              TODO: create author's page */}
              <Link href={`/authors/${author.id}`} className="text-lg font-semibold text-foreground hover:underline">
                {author.name}
              </Link>
            </div>

            <Link href={author.articleUrl} className="text-lg font-semibold text-primary hover:underline">
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
