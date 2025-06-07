"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Suspense,
} from "react";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  //   useScroll,
  //   useTransform,
} from "framer-motion";
import { Radio, Sparkles, Zap, Globe } from "lucide-react";
import { toast } from "sonner";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import NewsCardSkeleton from "@/components/live/news-card-skeleton";
import React from "react";

const NewsFilter = dynamic(() => import("@/components/live/news-filter"), {
  ssr: false,
  loading: () => <div>Loading filter...</div>,
});

const NewsCard = dynamic(() => import("@/components/live/news-card"), {
  ssr: false,
  loading: () => <NewsCardSkeleton />,
});

function NewsGlobe() {
  const meshRef = useRef<THREE.Object3D>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} scale={[2, 2, 2]} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

const MemoizedNewsGlobe = React.memo(NewsGlobe);

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  coordinates: [number, number];
  content: string;
  url: string;
  publishedAt: string;
  author: string;
  source: { name: string; url: string };
  category: NewsCategory;
  sentiment: NewsSentiment;
  tags: string[];
  readTime: number;
  imageUrl?: string;
  aiGeneratedSummary: string;
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
  const [globalNewsMood, setGlobalNewsMood] =
    useState<NewsSentiment>("neutral");
  const [filters, setFilters] = useState<{
    category: string | null;
    searchQuery: string;
    sentiment: string | null;
  }>({
    category: null,
    searchQuery: "",
    sentiment: null,
  });

  //   const pageRef = useRef(null);
  //   const { scrollYProgress } = useScroll({ container: pageRef });
  //   const backgroundColor = useTransform(
  //     scrollYProgress,
  //     [0, 1],
  //     ["#f9f9f9", "#000000"]
  //   );

  const generateInitialArticles = useCallback(() => {
    return Array.from({ length: 20 }, (_, index) =>
      generateSingleArticle(index)
    );
  }, []);

  const fetchNews = useCallback(() => {
    try {
      const newsData = Array.from({ length: 20 }, (_, index) =>
        generateSingleArticle(index)
      );
      setArticles((prevArticles) => {
        const updatedArticles = [...newsData, ...prevArticles].slice(0, 40);
        return updatedArticles;
      });

      const sentimentCounts = newsData.reduce((acc, news) => {
        acc[news.sentiment] = (acc[news.sentiment] || 0) + 1;
        return acc;
      }, {} as Record<NewsSentiment, number>);

      const dominantSentiment = Object.entries(sentimentCounts).reduce(
        (a, b) => (a[1] > b[1] ? a : b),
        ["neutral", 0]
      )[0] as NewsSentiment;

      setGlobalNewsMood(dominantSentiment);

      toast.success("Global News Network Updated", {
        description: `Mood: ${dominantSentiment.toUpperCase()}`,
        icon: <Zap className="text-yellow-500" />,
      });
    } catch {
      toast.error("Global News Network Disruption", {
        description: "Connection to news satellites lost",
      });
    }
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: {
      category?: string;
      searchQuery?: string;
      sentiment?: string;
    }) => {
      setFilters({
        category: newFilters.category || null,
        searchQuery: newFilters.searchQuery || "",
        sentiment: newFilters.sentiment || null,
      });
    },
    []
  );

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
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
  }, [articles, filters]);

  useEffect(() => {
    setArticles(generateInitialArticles());
    setGlobalNewsMood(calculateDominantSentiment(generateInitialArticles()));
  }, [generateInitialArticles]);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const articleGridVariants = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }),
    []
  );

  return (
    <motion.div
      //   ref={pageRef}
      style={
        {
          // background: backgroundColor,
          // minHeight: "100vh",
          // overflow: "hidden",
        }
      }
      className="relative text-white"
    >
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div>Loading 3D Globe...</div>}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <MemoizedNewsGlobe />
          </Canvas>
        </Suspense>
      </div>

      <div className="relative z-10 container mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Radio className="w-12 h-12 text-blue-300 animate-pulse" />
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-green-300">
              OpenNews Live
            </h1>
          </div>

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 bg-blue-600/30 px-4 py-2 rounded-full"
          >
            <Sparkles
              className={`
                ${
                  globalNewsMood === "positive"
                    ? "text-green-300"
                    : globalNewsMood === "negative"
                    ? "text-red-300"
                    : "text-blue-300"
                }
              `}
            />
            <span>Global News Mood: {globalNewsMood.toUpperCase()}</span>
          </motion.div>
        </header>

        <NewsFilter
          onFilterChange={handleFilterChange}
          currentFilters={filters}
        />

        <AnimatePresence>
          <motion.div
            variants={articleGridVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                  transition: { duration: 0.3 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
                }}
                className={`
                  relative 
                  transform 
                  transition-all 
                  duration-300 
                  ease-in-out
                  ${getArticleBackgroundByCategory(article.category)}
                  ${getArticleBorderBySentiment(article.sentiment)}
                  rounded-xl 
                  overflow-hidden 
                  shadow-2xl
                  hover:scale-105
                  hover:z-10
                `}
              >
                <div
                  className="absolute top-2 right-2 z-10"
                  style={{
                    transform: `rotate(${calculateRotationFromCoordinates(
                      article.coordinates
                    )}deg)`,
                  }}
                >
                  <Globe
                    className={`
                      w-8 h-8 
                      ${getGlobeColorBySentiment(article.sentiment)}
                    `}
                  />
                </div>

                <NewsCard
                  article={{
                    ...article,
                  }}
                />

                <div className="absolute bottom-2 left-2 flex space-x-1">
                  {getGeoTags(article.coordinates).map((tag) => (
                    <div
                      key={tag}
                      className="bg-black/50 text-white text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function generateSingleArticle(index: number): NewsArticle {
  return {
    id: crypto.randomUUID(),
    title: `Global Event ${index + 1}`,
    description: `Detailed global news description ${index + 1}`,
    coordinates: [
      Math.random() * 180 * (Math.random() > 0.5 ? 1 : -1),
      Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
    ],
    category: getRandomCategory(),
    sentiment: getRandomSentiment(),
    content: `Content for global event ${index + 1}`,
    url: `https://news.example.com/event-${index + 1}`,
    publishedAt: new Date().toISOString(),
    author: `Author ${index + 1}`,
    source: {
      name: `Source ${index + 1}`,
      url: `https://source.example.com`,
    },
    tags: [`tag${index + 1}`, `global`],
    readTime: Math.floor(Math.random() * 10) + 1,
    imageUrl: `https://picsum.photos/seed/${index + 1}/400/300`,
    aiGeneratedSummary: `Summary of global event ${index + 1}`,
    geoPosition: [
      Math.random() * 180 * (Math.random() > 0.5 ? 1 : -1),
      Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
    ],
  };
}

function calculateDominantSentiment(articles: NewsArticle[]): NewsSentiment {
  const sentimentCounts = articles.reduce((acc, curr) => {
    acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<NewsSentiment, number>);

  const sentiments: NewsSentiment[] = [
    "positive",
    "negative",
    "neutral",
    "controversial",
  ];
  const [sentiment] = Object.entries(sentimentCounts).reduce(
    ([aKey, aValue], [bKey, bValue]) =>
      bValue > aValue ? [bKey, bValue] : [aKey, aValue],
    ["neutral", 0]
  );

  return sentiments.includes(sentiment as NewsSentiment)
    ? (sentiment as NewsSentiment)
    : "neutral";
}

function getArticleBackgroundByCategory(category: NewsCategory): string {
  const categoryColors: Record<NewsCategory, string> = {
    global: "bg-gradient-to-br from-blue-900 to-blue-600",
    technology: "bg-gradient-to-br from-purple-900 to-purple-600",
    politics: "bg-gradient-to-br from-red-600 to-red-400",
    science: "bg-gradient-to-br from-green-900 to-green-600",
    entertainment: "bg-gradient-to-br from-yellow-900 to-yellow-600",
    health: "bg-gradient-to-br from-indigo-900 to-indigo-600",
    sports: "bg-gradient-to-br from-orange-900 to-orange-600",
  };
  return categoryColors[category] || "bg-gray-800";
}

function getArticleBorderBySentiment(sentiment: NewsSentiment): string {
  const sentimentBorders: Record<NewsSentiment, string> = {
    positive: "border-4 border-green-400",
    negative: "border-4 border-red-400",
    neutral: "border-4 border-blue-400",
    controversial: "border-4 border-yellow-400",
  };
  return sentimentBorders[sentiment] || "";
}

function calculateRotationFromCoordinates([lat, lon]: [
  number,
  number
]): number {
  return (Math.atan2(lon, lat) * 180) / Math.PI;
}

function getGlobeColorBySentiment(sentiment: NewsSentiment): string {
  const sentimentColors: Record<NewsSentiment, string> = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-blue-400",
    controversial: "text-yellow-400",
  };
  return sentimentColors[sentiment] || "text-blue-400";
}

function getGeoTags([lat, lon]: [number, number]): string[] {
  const hemisphere = lat > 0 ? "Northern" : "Southern";
  const longHemisphere = lon > 0 ? "Eastern" : "Western";
  return [
    `${hemisphere} Hemisphere`,
    `${longHemisphere}`,
    `${Math.abs(lat).toFixed(2)}° ${lat > 0 ? "N" : "S"}`,
    `${Math.abs(lon).toFixed(2)}° ${lon > 0 ? "E" : "W"}`,
  ];
}

const getRandomCategory = (): NewsCategory => {
  const categories: NewsCategory[] = [
    "global",
    "technology",
    "politics",
    "science",
    "entertainment",
    "health",
    "sports",
  ];
  return categories[Math.floor(Math.random() * categories.length)];
};

const getRandomSentiment = (): NewsSentiment => {
  const sentiments: NewsSentiment[] = [
    "positive",
    "negative",
    "neutral",
    "controversial",
  ];
  return sentiments[Math.floor(Math.random() * sentiments.length)];
};
