"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Bookmark,
  Heart,
  MessageCircle,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useUser } from "@/lib/context/user-context";
import { usePlan } from "@/components/subscribe/plan-context";
import { toast } from "sonner";
import Image from "next/image";
import * as THREE from "three";
import ModelLoadingSkeleton from "@/components/open-channel/model-loadning-skeleton";

const EditorProfileModel = dynamic(
  () => import("@/components/open-channel/editor-profile-model"),
  {
    ssr: false,
    loading: () => <ModelLoadingSkeleton />,
  }
);

// Access Denied Banner Component
const AccessDeniedBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center gap-4"
  >
    <p className="text-sm">
      Open Channel is exclusive to Elite and Business subscribers.
    </p>
    <Link href="/subscribe">
      <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100">
        See Plans
      </Button>
    </Link>
  </motion.div>
);

// Zod Schemas
const ArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  headline: z.string(),
  summary: z.string(),
  content: z.string(),
  image: z.string().nullable(),
  claps: z.number(),
  views: z.number(),
  isEditorsChoice: z.boolean(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  author: z.object({
    id: z.string(),
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  comments: z.array(z.object({ id: z.string(), content: z.string() })),
  categories: z.array(z.object({ title: z.string() })),
  aiRecommendationScore: z.number().min(0).max(100),
  readingTimeOptimized: z.number(),
  complexityLevel: z.enum(["beginner", "intermediate", "advanced"]),
  sentimentAnalysis: z.object({
    tone: z.enum(["positive", "neutral", "negative"]),
    confidence: z.number().min(0).max(1),
  }),
  relatedTopics: z.array(z.string()),
  interactionMetrics: z.object({
    engagementRate: z.number(),
    viralPotential: z.number(),
  }),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  followers: z.number(),
  role: z.string(),
});

type Article = z.infer<typeof ArticleSchema>;
type User = z.infer<typeof UserSchema>;

// Mock Data
const mockArticles: Article[] = Array.from({ length: 20 }, (_, index) => ({
  id: `article${index + 1}`,
  title: `Breaking News: ${index + 1} - AI Journalism Revolution`,
  description: `Exploring the impact of AI on modern journalism in article ${
    index + 1
  }.`,
  headline: `AI Journalism Breakthrough ${index + 1}`,
  summary: `AI transforms media with innovative tools in article ${index + 1}.`,
  content: `<p>This is the full content of article ${
    index + 1
  }. AI is revolutionizing how news is created and consumed.</p>`,
  image: `https://picsum.photos/id/${(index + 1) % 1000}/800/600`,
  claps: Math.floor(Math.random() * 5000),
  views: Math.floor(Math.random() * 10000),
  isEditorsChoice: index < 10,
  tags: ["AI", "Journalism", "Technology"],
  createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
  author: {
    id: `editor${(index % 3) + 1}`,
    name: `Dr. Editor ${
      index % 3 === 0 ? "Rodriguez" : index % 3 === 1 ? "Smith" : "Lee"
    }`,
    image: `https://placehold.co/100x100?text=Editor${(index % 3) + 1}`,
  },
  comments: [
    { id: `comment${index + 1}-1`, content: `Great article ${index + 1}!` },
    { id: `comment${index + 1}-2`, content: `Very insightful ${index + 1}.` },
  ],
  categories: [{ title: "Technology" }, { title: "Innovation" }],
  aiRecommendationScore: Math.floor(Math.random() * 100),
  readingTimeOptimized: Math.floor(Math.random() * 10) + 1,
  complexityLevel:
    index % 3 === 0
      ? "beginner"
      : index % 3 === 1
      ? "intermediate"
      : "advanced",
  sentimentAnalysis: {
    tone:
      index % 3 === 0 ? "positive" : index % 3 === 1 ? "neutral" : "negative",
    confidence: Math.random(),
  },
  relatedTopics: ["AI", "Media", "Innovation"],
  interactionMetrics: {
    engagementRate: Math.random(),
    viralPotential: Math.random(),
  },
}));

const mockEditors: User[] = [
  {
    id: "editor1",
    name: "Dr. Elena Rodriguez",
    image: "https://placehold.co/100x100?text=Editor1",
    followers: 24500,
    role: "editor",
  },
  {
    id: "editor2",
    name: "John Smith",
    image: "https://placehold.co/100x100?text=Editor2",
    followers: 18000,
    role: "editor",
  },
  {
    id: "editor3",
    name: "Sarah Lee",
    image: "https://placehold.co/100x100?text=Editor3",
    followers: 32000,
    role: "editor",
  },
];

// AI-Enhanced Recommendation Logic
function useAIRecommendations(articles: Article[]) {
  const [recommendations, setRecommendations] = useState<Article[]>([]);

  useEffect(() => {
    const calculateRecommendations = () => {
      return articles
        .sort((a, b) => b.aiRecommendationScore - a.aiRecommendationScore)
        .slice(0, 5);
    };

    setRecommendations(calculateRecommendations());
  }, [articles]);

  return recommendations;
}

// 3D Immersive Component
function ArticleVisualization({ article }: { article: Article }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(300, 200); // Fixed size for modal

    const generateArticleGeometry = () => {
      const complexity = article.complexityLevel;
      const geometryMap = {
        beginner: new THREE.SphereGeometry(1, 32, 32),
        intermediate: new THREE.TorusGeometry(1, 0.4, 16, 100),
        advanced: new THREE.IcosahedronGeometry(1, 2),
      };

      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(
          article.sentimentAnalysis.tone === "positive"
            ? 0x00ff00
            : article.sentimentAnalysis.tone === "negative"
            ? 0xff0000
            : 0x0000ff
        ),
        transparent: true,
        opacity: article.sentimentAnalysis.confidence,
      });

      return new THREE.Mesh(geometryMap[complexity], material);
    };

    const articleMesh = generateArticleGeometry();
    scene.add(articleMesh);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      articleMesh.rotation.x += 0.01;
      articleMesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, [article]);

  return <canvas ref={canvasRef} className="w-full h-[200px]" />;
}

// Optimized Article Card
const OptimizedArticleCard = React.memo(({ article }: { article: Article }) => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, type: "spring" },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
      className="bg-transparent rounded-lg p-4 cursor-pointer text-white relative"
    >
      <div className="relative h-32 mb-4">
        <Image
          src={
            article.image ||
            "https://via.placeholder.com/400x200.png?text=Image+Not+Found"
          }
          alt={article.title}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex justify-between items-center">
            <Badge
              variant={
                article.complexityLevel === "advanced"
                  ? "destructive"
                  : "secondary"
              }
            >
              {article.complexityLevel}
            </Badge>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                transition: { repeat: Infinity, duration: 1.5 },
              }}
            >
              <Star
                className={`${
                  article.aiRecommendationScore > 80
                    ? "text-yellow-400"
                    : "text-gray-500"
                }`}
              />
            </motion.div>
          </div>
        </div>
      </div>
      <h4 className="text-lg font-semibold mb-2">{article.headline}</h4>
      <p className="text-xs text-gray-300 line-clamp-2">{article.summary}</p>
    </motion.div>
  );
});
OptimizedArticleCard.displayName = "OptimizedArticleCard";

// Wrap page in dynamic to disable SSR
const OpenChannelPage = () => {
  const { subscriptionType, isLoading: userLoading } = useUser();
  const { currentPlan, isLoading: planLoading } = usePlan();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editors, setEditors] = useState<User[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [editorsLoading, setEditorsLoading] = useState(true);
  const articlesPerPage = 12;

  const aiRecommendations = useAIRecommendations(articles);

  // Debug subscriptionType and currentPlan
  useEffect(() => {
    console.log("subscriptionType (useUser):", subscriptionType);
    console.log("currentPlan (usePlan):", currentPlan);
  }, [subscriptionType, currentPlan]);

  // Mock Article Fetch
  useEffect(() => {
    const fetchArticles = async () => {
      setArticlesLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      const start = (currentPage - 1) * articlesPerPage;
      const end = start + articlesPerPage;
      const fetchedArticles = mockArticles
        .filter((article) => article.isEditorsChoice)
        .slice(start, end)
        .map((article) => ArticleSchema.parse(article));
      setArticles(fetchedArticles);
      setArticlesLoading(false);
    };

    fetchArticles();
  }, [currentPage]);

  // Mock Editor Fetch
  useEffect(() => {
    const fetchEditors = async () => {
      setEditorsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      const fetchedEditors = mockEditors.map((editor) =>
        UserSchema.parse(editor)
      );
      setEditors(fetchedEditors);
      setEditorsLoading(false);
    };

    fetchEditors();
  }, []);

  // Mock Follow Editor
  const followEditor = async (editorId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      setEditors((prev) =>
        prev.map((editor) =>
          editor.id === editorId
            ? { ...editor, followers: editor.followers + 1 }
            : editor
        )
      );
      toast.success("Editor followed");
    } catch {
      toast.error("Failed to follow editor");
    }
  };

  // Save Article
  const handleSaveArticle = useCallback(
    (articleId: string) => {
      setSavedArticles((prev) =>
        prev.includes(articleId)
          ? prev.filter((id) => id !== articleId)
          : [...prev, articleId]
      );
      toast.success(
        savedArticles.includes(articleId) ? "Article unsaved" : "Article saved"
      );
    },
    [savedArticles]
  );

  // Always call hooks at the top level
  const featuredArticles = useMemo(
    () => articles.slice(0, 2) || [],
    [articles]
  );
  const sideArticles = useMemo(() => articles.slice(2, 6) || [], [articles]);
  const gridArticles = useMemo(() => articles.slice(6) || [], [articles]);

  // Show loading skeleton
  if (userLoading || planLoading || articlesLoading || editorsLoading) {
    return <ModelLoadingSkeleton />;
  }

  // Check access for banner using currentPlan
  const hasAccess = currentPlan === "Elite" || currentPlan === "Business";

  return (
    <>
      {!hasAccess && <AccessDeniedBanner />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen text-white"
      >
        {/* New Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center px-4"
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <EditorProfileModel />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                New on Open Channel
              </h1>
              <p className="text-lg md:text-2xl mt-4 text-white/80 max-w-2xl mx-auto">
                Business subscribers craft unique stories on My Channel.
                Subscribe to Elite to read exclusive editor content.
              </p>
              <Link href="/subscribe">
                <Button
                  variant="default"
                  size="lg"
                  className="mt-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  See Plans <Rocket className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* AI Recommended Articles */}
        <section className="container mx-auto py-16">
          <h2 className="text-4xl font-bold mb-12 text-center">
            AI Recommended Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map((article) => (
                <OptimizedArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p className="text-center text-gray-400">
                No recommendations available.
              </p>
            )}
          </div>
        </section>

        {/* Featured Articles */}
        <section className="container mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {featuredArticles.length > 0 ? (
                featuredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-transparent rounded-xl overflow-hidden shadow-2xl cursor-pointer text-white"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="relative h-64">
                      <Image
                        src={
                          article.image ||
                          "https://via.placeholder.com/800x400.png?text=Image+Not+Found"
                        }
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <Image
                          src={
                            article.author.image ||
                            "https://placehold.co/100x100?text=Default"
                          }
                          alt={article.author.name || "Anonymous"}
                          width={40}
                          height={40}
                          className="rounded-full mr-3"
                        />
                        <span className="text-sm font-semibold">
                          {article.author.name || "Anonymous"}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-3 mb-4">
                        {article.summary}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-4">
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" /> {article.claps}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />{" "}
                            {article.comments.length}
                          </span>
                          <Bookmark
                            className={`w-4 h-4 cursor-pointer ${
                              savedArticles.includes(article.id)
                                ? "fill-blue-500 text-blue-500"
                                : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveArticle(article.id);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No featured articles available.
                </p>
              )}
            </div>
            <div className="space-y-4">
              {sideArticles.length > 0 ? (
                sideArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-transparent rounded-lg p-4 cursor-pointer text-white"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className="relative h-32 mb-4">
                      <Image
                        src={
                          article.image ||
                          "https://via.placeholder.com/400x200.png?text=Image+Not+Found"
                        }
                        alt={article.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      {article.headline}
                    </h4>
                    <p className="text-xs text-gray-300 line-clamp-2">
                      {article.summary}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No side articles available.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Grid Articles */}
        <section className="container mx-auto py-8">
          {gridArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gridArticles.map((article) => (
                <motion.div
                  key={article.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-transparent rounded-lg p-4 cursor-pointer text-white"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative h-32 mb-4">
                    <Image
                      src={
                        article.image ||
                        "https://via.placeholder.com/400x200.png?text=Image+Not+Found"
                      }
                      alt={article.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    {article.headline}
                  </h4>
                  <p className="text-xs text-gray-300 line-clamp-2">
                    {article.summary}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No more articles available.
            </p>
          )}
          {articles.length >= articlesPerPage && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                See More Recommended Stories <ChevronRight className="ml-2" />
              </Button>
            </div>
          )}
        </section>

        {/* Separator */}
        <div className="container mx-auto py-16">
          <hr className="border-gray-600" />
        </div>

        {/* Who to Follow */}
        <section className="container mx-auto py-16">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Who to Follow
          </h2>
          <div className="relative">
            <motion.div
              className="flex overflow-x-auto space-x-6 pb-8 scrollbar-hide"
              drag="x"
              dragConstraints={{ left: -1000, right: 0 }}
            >
              {editors.length > 0 ? (
                editors.map((editor) => (
                  <motion.div
                    key={editor.id}
                    whileHover={{ scale: 1.05 }}
                    className="min-w-[250px] bg-white rounded-xl p-6 text-center"
                  >
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <EditorProfileModel image={editor.image} />
                    </div>
                    <h3 className="text-lg font-semibold text-black">
                      {editor.name || "Anonymous"}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {editor.followers} Followers
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      Expert in journalism and media trends.
                    </p>
                    <Button
                      onClick={() => followEditor(editor.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Follow
                    </Button>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-400">
                  No editors available.
                </p>
              )}
            </motion.div>
          </div>
          <div className="flex justify-center mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700">
              See More <ChevronRight className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Article Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <Dialog
              open={!!selectedArticle}
              onOpenChange={() => setSelectedArticle(null)}
            >
              <DialogContent className="max-w-4xl">
                <DialogTitle>{selectedArticle.title}</DialogTitle>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Image
                      src={
                        selectedArticle.author.image ||
                        "https://placehold.co/100x100?text=Default"
                      }
                      alt={selectedArticle.author.name || "Anonymous"}
                      width={40}
                      height={40}
                      className="rounded-full mr-3"
                    />
                    <span className="font-semibold text-black">
                      {selectedArticle.author.name || "Anonymous"}
                    </span>
                  </div>
                  <div className="relative h-96 mb-6">
                    <Image
                      src={
                        selectedArticle.image ||
                        "https://via.placeholder.com/800x400.png?text=Image+Not+Found"
                      }
                      alt={selectedArticle.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <ArticleVisualization article={selectedArticle} />
                  <p className="text-lg mb-4 text-black">
                    {selectedArticle.summary}
                  </p>
                  <div
                    className="text-black"
                    dangerouslySetInnerHTML={{
                      __html: selectedArticle.content,
                    }}
                  />
                  <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
                    <span>
                      {new Date(selectedArticle.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-4">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />{" "}
                        {selectedArticle.claps}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />{" "}
                        {selectedArticle.comments.length}
                      </span>
                      <Bookmark
                        className={`w-4 h-4 cursor-pointer ${
                          savedArticles.includes(selectedArticle.id)
                            ? "fill-blue-500 text-blue-500"
                            : ""
                        }`}
                        onClick={() => handleSaveArticle(selectedArticle.id)}
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Complexity: {selectedArticle.complexityLevel}</p>
                    <p>AI Score: {selectedArticle.aiRecommendationScore}</p>
                    <p>Tone: {selectedArticle.sentimentAnalysis.tone}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default dynamic(() => Promise.resolve(OpenChannelPage), { ssr: false });
