import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";

type ExpertInsightsSectionProps = {
  authors: {
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
   <h2 className="flex items-center gap-2 text-2xl font-bold font-inika mb-6">
Expert Insights        <ArrowBigRight className="w-8 h-8 text-primary" />
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
              <h3 className="text-lg font-semibold text-foreground">{author.name}</h3>
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
