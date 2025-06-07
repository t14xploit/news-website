"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Bell, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NewsCardSkeleton from "@/components/live/news-card-skeleton";

const NewsFilter = dynamic(() => import("@/components/live/news-filter"), {
  ssr: false,
});

const NewsCard = dynamic<{ article: NewsArticle }>(
  () => import("@/components/live/news-card"),
  {
    loading: () => <NewsCardSkeleton />,
    ssr: false,
  }
);

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: string;
  author: string;
  source: {
    name: string;
    url: string;
  };
  category: NewsCategory;
  sentiment: NewsSentiment;
  tags: string[];
  readTime: number;
  imageUrl?: string;
  aiGeneratedSummary?: string;
  geoPosition?: [number, number];
}

type NewsCategory =
  | "global"
  | "technology"
  | "politics"
  | "science"
  | "entertainment"
  | "health"
  | "sports";

type NewsSentiment = "positive" | "negative" | "neutral" | "controversial";

export default function OpenNewsLivePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);
  const [realTimeUpdates, setRealTimeUpdates] = useState<NewsArticle[]>([]);
  const [filters, setFilters] = useState({
    category: null as NewsCategory | null,
    searchQuery: "",
    sentiment: null as NewsSentiment | null,
  });
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const maxArticles = totalPages * 24;
  const fetchCooldown = 5000;

  const fetchNews = useCallback(
    async (page = 1) => {
      const now = Date.now();
      if (now - lastFetchTime < fetchCooldown) {
        console.log("Fetch throttled: Waiting for cooldown");
        return;
      }
      if (articles.length >= maxArticles && page !== 1) {
        setIsLoading(false);
        console.log("Max articles reached");
        return;
      }
      setIsLoading(true);
      console.log(`Fetching news for page ${page}`);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const generateMockArticles = (count: number): NewsArticle[] => {
          const categories: NewsCategory[] = [
            "global",
            "technology",
            "politics",
            "science",
            "entertainment",
            "health",
            "sports",
          ];
          const sentiments: NewsSentiment[] = [
            "positive",
            "negative",
            "neutral",
            "controversial",
          ];

          const articlesPerCategory = Math.floor(count / categories.length);
          const extraArticles = count % categories.length;
          const result: NewsArticle[] = [];

          categories.forEach((category, catIndex) => {
            const numArticles =
              articlesPerCategory + (catIndex < extraArticles ? 1 : 0);
            for (let i = 0; i < numArticles; i++) {
              const index = result.length + 1;
              result.push({
                id: crypto.randomUUID(),
                title: `Breaking News: ${getArticleTitle(category, index)}`,
                description: `Detailed description of the news article ${page}-${index}`,
                content: getArticleContent(
                  category,
                  sentiments[Math.floor(Math.random() * 4)],
                  page,
                  index
                ),
                url: `https://example.com/news/${page}-${index}`,
                publishedAt: new Date(
                  Date.now() - index * 24 * 60 * 60 * 1000
                ).toISOString(),
                author: `Author ${index}`,
                source: {
                  name: `News Source ${(index % 3) + 1}`,
                  url: `https://example.com/source${(index % 3) + 1}`,
                },
                category,
                sentiment: sentiments[Math.floor(Math.random() * 4)],
                tags: ["trending", "breaking", "important"].slice(
                  0,
                  Math.floor(Math.random() * 3) + 1
                ),
                readTime: Math.floor(Math.random() * 10) + 2,
                imageUrl: `https://picsum.photos/id/${
                  (index + page * 24) % 1000
                }/800/600`,
                aiGeneratedSummary: `AI-generated summary for article ${page}-${index}`,
                geoPosition: [
                  Number((Math.random() * 180 - 90).toFixed(4)),
                  Number((Math.random() * 360 - 180).toFixed(4)),
                ],
              });
            }
          });

          for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
          }

          return result;
        };

        const mockNewsData = generateMockArticles(24);
        const mockRealTimeUpdates = generateMockArticles(
          Math.floor(Math.random() * 4) + 3
        );

        setArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newArticles = mockNewsData.filter(
            (a) => !existingIds.has(a.id)
          );
          if (page === 1) {
            return newArticles.slice(0, 24);
          }
          const remainingSlots = maxArticles - prev.length;
          return [...prev, ...newArticles.slice(0, remainingSlots)];
        });

        if (mockRealTimeUpdates.length > 0) {
          setRealTimeUpdates((prev) => {
            const existingIds = new Set(
              [...articles, ...prev].map((a) => a.id)
            );
            const newUpdates = mockRealTimeUpdates.filter(
              (a) => !existingIds.has(a.id)
            );
            return [...prev, ...newUpdates].slice(0, 6);
          });
          toast.info(`${mockRealTimeUpdates.length} new articles`, {
            description: "Fresh news just arrived!",
            icon: <Bell className="text-blue-500" />,
          });
        }

        setLastFetchTime(now);
      } catch (error) {
        console.error("News fetching error", error);
        toast.error("Failed to load news", {
          description: "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [maxArticles, lastFetchTime, articles]
  );

  const filteredArticles = useMemo(() => {
    const result = articles.filter((article) => {
      const matchesCategory =
        !filters.category || article.category === filters.category;
      const matchesSentiment =
        !filters.sentiment || article.sentiment === filters.sentiment;
      const matchesSearch =
        !filters.searchQuery ||
        article.title
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) ||
        article.description
          .toLowerCase()
          .includes(filters.searchQuery.toLowerCase());
      return matchesCategory && matchesSentiment && matchesSearch;
    });
    console.log("Filters:", filters);
    console.log(
      "Filtered articles:",
      result.map((a) => ({ id: a.id, category: a.category }))
    );
    return result;
  }, [articles, filters]);

  useEffect(() => {
    if (articles.length === 0) {
      fetchNews(1);
    }
  }, [fetchNews, articles.length]);

  const handleFilterChange = useCallback(
    (newFilters: {
      category?: string;
      searchQuery?: string;
      sentiment?: string;
    }) => {
      setFilters((prev) => ({
        ...prev,
        category:
          newFilters.category !== undefined
            ? (newFilters.category as NewsCategory | null)
            : prev.category,
        searchQuery:
          newFilters.searchQuery !== undefined
            ? newFilters.searchQuery
            : prev.searchQuery,
        sentiment:
          newFilters.sentiment !== undefined
            ? (newFilters.sentiment as NewsSentiment | null)
            : prev.sentiment,
      }));
      setCurrentPage(1);
    },
    []
  );

  const handleLoadMore = () => {
    if (currentPage < totalPages && articles.length < maxArticles) {
      setCurrentPage((prev) => {
        const nextPage = prev + 1;
        fetchNews(nextPage);
        return nextPage;
      });
    }
  };

  const mergeRealTimeUpdates = () => {
    setArticles((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const newUpdates = realTimeUpdates.filter((a) => !existingIds.has(a.id));
      const remainingSlots = maxArticles - prev.length;
      return [...newUpdates.slice(0, remainingSlots), ...prev];
    });
    setRealTimeUpdates([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 bg-gradient-to-br min-h-screen"
    >
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center space-x-4">
          <Radio className="w-12 h-12 text-blue-500 animate-pulse" />
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
            OpenNews Live
          </h1>
        </div>

        {realTimeUpdates.length > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-2 bg-blue-600/50 px-4 py-2 rounded-full"
          >
            <Bell className="text-blue-300" />
            <span>{realTimeUpdates.length} New Articles</span>
            <Button size="sm" onClick={mergeRealTimeUpdates}>
              Show Now
            </Button>
          </motion.div>
        )}
      </motion.header>

      <NewsFilter
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />

      <AnimatePresence>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </motion.div>
      </AnimatePresence>

      {currentPage < totalPages && articles.length < maxArticles && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={handleLoadMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Load More News"}
          </motion.button>
        </div>
      )}

      {!isLoading && filteredArticles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400"
        >
          No articles found
        </motion.div>
      )}
    </motion.div>
  );
}

function getArticleTitle(category: NewsCategory, index: number): string {
  const titles: Record<NewsCategory, string[]> = {
    global: [
      `Global Summit Addresses Climate Crisis ${index}`,
      `Peace Talks Resume in Region ${index}`,
    ],
    technology: [
      `New AI Breakthrough Unveiled ${index}`,
      `Tech Giant Launches Device ${index}`,
    ],
    politics: [
      `Election Results Spark Debate ${index}`,
      `New Policy Proposed ${index}`,
    ],
    science: [
      `Exoplanet Discovery Excites Scientists ${index}`,
      `Quantum Leap Forward ${index}`,
    ],
    entertainment: [
      `Blockbuster Movie Premieres ${index}`,
      `Music Awards Celebrate Stars ${index}`,
    ],
    health: [
      `Vaccine Rollout Expands ${index}`,
      `Mental Health Initiative Launched ${index}`,
    ],
    sports: [
      `Team Wins Championship ${index}`,
      `Athlete Breaks Record ${index}`,
    ],
  };
  return titles[category][Math.floor(Math.random() * titles[category].length)];
}

function getArticleContent(
  category: NewsCategory,
  sentiment: NewsSentiment,
  page: number,
  index: number
): string {
  const contentTemplates: Record<
    NewsCategory,
    (sentiment: NewsSentiment) => string
  > = {
    global: (s) => `
      <p>In a significant development, world leaders gathered today for the ${index}th Global Summit to address pressing environmental challenges. The summit, held in a major city, focused on reducing carbon emissions by 2030.</p>
      <p>"We are at a critical juncture," said a prominent diplomat. "${
        s === "positive"
          ? "Collaboration is yielding results"
          : s === "negative"
          ? "Progress is too slow"
          : "Efforts continue steadily"
      }."</p>
      <p>Analysts ${
        s === "controversial"
          ? "remain divided on the outcomes"
          : "are cautiously optimistic"
      }. The next steps include regional agreements and funding commitments.</p>
    `,
    technology: (s) => `
      <p>A leading tech company unveiled its latest innovation today, the ${index}X processor, promising unprecedented performance. The launch event drew thousands of enthusiasts.</p>
      <p>"This changes everything," claimed the CEO. "${
        s === "positive"
          ? "It’s a game-changer"
          : s === "negative"
          ? "But costs are prohibitive"
          : "It’s a solid step forward"
      }."</p>
      <p>Critics ${
        s === "controversial"
          ? "debate its accessibility"
          : "praise its efficiency"
      }. The product will hit markets next quarter.</p>
    `,
    politics: (s) => `
      <p>The recent elections in region ${index} have sparked widespread discussion. The winning party’s platform emphasizes economic reform.</p>
      <p>"This is a new era," declared the elected official. "${
        s === "positive"
          ? "Voters are hopeful"
          : s === "negative"
          ? "Protests have erupted"
          : "The transition is smooth"
      }."</p>
      <p>Observers ${
        s === "controversial" ? "predict tension" : "expect stability"
      }. Policy changes are anticipated soon.</p>
    `,
    science: (s) => `
      <p>Scientists announced the discovery of a new exoplanet, dubbed Planet ${index}B, located in a habitable zone. The finding was published today.</p>
      <p>"This is thrilling," said the lead researcher. "${
        s === "positive"
          ? "It could support life"
          : s === "negative"
          ? "But it’s too distant"
          : "More study is needed"
      }."</p>
      <p>The discovery ${
        s === "controversial"
          ? "sparks debate on exploration"
          : "inspires future missions"
      }. Telescopes will monitor the planet closely.</p>
    `,
    entertainment: (s) => `
      <p>The ${index}th Annual Music Awards celebrated top artists in a star-studded ceremony. Performances captivated global audiences.</p>
      <p>"It was unforgettable," said a fan. "${
        s === "positive"
          ? "Winners deserved praise"
          : s === "negative"
          ? "Some felt snubbed"
          : "The event ran smoothly"
      }."</p>
      <p>Critics ${
        s === "controversial"
          ? "question the voting process"
          : "laud the diversity"
      }. Highlights are trending online.</p>
    `,
    health: (s) => `
      <p>A new health initiative, Program ${index}, aims to improve access to care. Launched today, it targets underserved communities.</p>
      <p>"This is vital," said a healthcare leader. "${
        s === "positive"
          ? "It’s transformative"
          : s === "negative"
          ? "Funding is lacking"
          : "Progress is steady"
      }."</p>
      <p>Experts ${
        s === "controversial" ? "debate its scope" : "welcome the effort"
      }. Implementation begins next month.</p>
    `,
    sports: (s) => `
      <p>Team ${index} clinched the championship title in a thrilling final match. Fans flooded the streets in celebration.</p>
      <p>"We made history," said the captain. "${
        s === "positive"
          ? "It’s a triumph"
          : s === "negative"
          ? "Controversy marred the win"
          : "The team earned it"
      }."</p>
      <p>Analysts ${
        s === "controversial"
          ? "question referee calls"
          : "praise the performance"
      }. The season concludes with awards.</p>
    `,
  };
  return contentTemplates[category](sentiment);
}
