import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Share2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    description: string;
    content: string;
    imageUrl?: string;
    publishedAt: string;
    source: {
      name: string;
      url: string;
    };
    category: string;
    sentiment: string;
    readTime: number;
    author: string;
    tags?: string[];
    aiGeneratedSummary?: string;
    geoPosition?: number[];
  };
}

export default function NewsCard({ article }: NewsCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isExpanded, setIsExpanded] = useState(false);

  type SentimentType = "positive" | "negative" | "controversial" | "neutral";

  const getSentimentDetails = (sentiment: string) => {
    const sentimentMap: Record<
      SentimentType,
      { color: string; description: string }
    > = {
      positive: {
        color: "bg-green-500",
        description: "Optimistic Tone",
      },
      negative: {
        color: "bg-red-500",
        description: "Critical Perspective",
      },
      controversial: {
        color: "bg-yellow-500",
        description: "Balanced View",
      },
      neutral: {
        color: "bg-gray-500",
        description: "Objective Reporting",
      },
    };

    return sentimentMap[sentiment as SentimentType] || sentimentMap.neutral;
  };

  const { color, description } = getSentimentDetails(article.sentiment);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.title,
        url: article.source.url,
      });
    } else {
      navigator.clipboard.writeText(article.source.url);
      alert("Link copied to clipboard");
    }
  };

  const getGeoTags = (geoPosition?: number[]): string[] => {
    if (!geoPosition) return [];
    const [lat, lon] = geoPosition;
    const hemisphere = lat >= 0 ? "Northern" : "Southern";
    const longHemisphere = lon >= 0 ? "Eastern" : "Western";
    return [
      `${hemisphere} Hemisphere`,
      `${longHemisphere} Hemisphere`,
      `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"}`,
      `${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? "E" : "W"}`,
    ];
  };

  const fallbackImageUrl =
    "https://via.placeholder.com/800x600.png?text=No+Image";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="relative"
    >
      <Card className="hover:shadow-2xl transition-all duration-300 group">
        {article.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = fallbackImageUrl;
              }}
            />
          </div>
        )}

        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-2 pr-4">
              {article.title}
            </CardTitle>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-1"
            >
              <Badge variant="outline" className={`${color} text-white`}>
                {description}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center text-gray-400 text-sm">
              <Clock className="mr-1 w-4 h-4" />
              {article.readTime} min read
            </div>
          </div>

          <p className="text-sm text-gray-300 line-clamp-3 mb-4">
            {article.description}
          </p>

          {article.geoPosition && (
            <div className="flex flex-wrap gap-1 mb-4">
              {getGeoTags(article.geoPosition).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>

            <div className="flex space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(true)}
                  >
                    <BookOpen className="mr-2 w-4 h-4" />
                    Full Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogTitle>{article.title}</DialogTitle>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>By {article.author}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(article.publishedAt).toLocaleString()}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{article.source.name}</span>
                    </div>
                    <div
                      className="text-gray-300 prose prose-invert"
                      dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    {article.geoPosition && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold">Location</h4>
                        <div className="flex flex-wrap gap-1">
                          {getGeoTags(article.geoPosition).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
