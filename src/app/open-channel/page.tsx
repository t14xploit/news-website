"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
  Stars,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

ChartJS.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PersonalInfo {
  email: string;
  phone: string;
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  dob: {
    date: string;
  };
}

interface MlProfile {
  communicationStyle: string;
  intellectualDiversity: number;
  innovationCapacity: number;
}

interface Editor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  expertise: string[];
  followers: number;
  aiRank: number;
  mlProfile: MlProfile;
  personalInfo: PersonalInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
}

interface EditorListProps {
  editors: Editor[];
}

interface PersonalInfoCardProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

const MLInsightSchema = z.object({
  semanticSimilarity: z.number().min(0).max(1),
  emotionalTone: z.enum(["positive", "neutral", "negative"]),
  cognitiveComplexity: z.number().min(0).max(100),
  innovationPotential: z.number().min(0).max(100),
  ethicalScore: z.number().min(0).max(100),
});

const EditorPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  description: z.string(),
  coverImage: z.string().min(1, "Cover image is required"),
  createdAt: z.date(),
  likes: z.number(),
  views: z.number(),
  readTime: z.number(),
  tags: z.array(z.string()),
  mlInsights: MLInsightSchema,
  interactionHeatmap: z.record(z.string(), z.number()),
  recommendationVector: z.array(z.number()).length(4),
  aiGeneratedSummary: z.string(),
  geoPosition: z.array(z.number()).length(2),
  editorId: z.string(),
  editorName: z.string(),
  editorAvatar: z.string(),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  bio: z.string(),
  expertise: z.array(z.string()),
  followers: z.number(),
  aiRank: z.number(),
  mlProfile: z.object({
    communicationStyle: z.string(),
    intellectualDiversity: z.number(),
    innovationCapacity: z.number(),
  }),
  personalInfo: z.object({
    email: z.string(),
    phone: z.string(),
    location: z.object({
      street: z.object({
        number: z.number(),
        name: z.string(),
      }),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      postcode: z.string(),
    }),
    dob: z.object({
      date: z.string(),
    }),
  }),
});

type EditorPost = z.infer<typeof EditorPostSchema>;
type User = z.infer<typeof UserSchema>;

function AIEnhancedEditorGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 256, 256]} />
        <meshStandardMaterial color="#1e40af" roughness={0.4} metalness={0.6} />
      </mesh>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
    </group>
  );
}

function MLInsightsChart({
  insights,
}: {
  insights: z.infer<typeof MLInsightSchema>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chart = new ChartJS(ctx, {
      type: "radar",
      data: {
        labels: [
          "Semantic Similarity",
          "Cognitive Complexity",
          "Innovation Potential",
          "Ethical Score",
        ],
        datasets: [
          {
            label: "ML Insights",
            data: [
              insights.semanticSimilarity * 100,
              insights.cognitiveComplexity,
              insights.innovationPotential,
              insights.ethicalScore,
            ],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });

    return () => chart.destroy();
  }, [insights]);

  return <canvas ref={canvasRef} className="w-full h-[200px]" />;
}

// Utility function to format post numbers
const postNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

function generateAdvancedMockEditors(): {
  editors: User[];
  posts: EditorPost[];
} {
  const mockEditors: Editor[] = [
    {
      id: "editor1",
      name: "Sophie Müller",
      avatar: "https://randomuser.me/api/portraits/women/30.jpg",
      bio: "German media ethics researcher shaping EU media policy",
      expertise: ["AI Ethics", "EU Policy", "Journalism"],
      followers: 25000,
      aiRank: 93,
      mlProfile: {
        communicationStyle: "Analytical",
        intellectualDiversity: 86,
        innovationCapacity: 94,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+49) 151-234-5678",
        location: {
          street: { number: 12, name: "Schillerstraße" },
          city: "Munich",
          state: "Bavaria",
          country: "Germany",
          postcode: "80331",
        },
        dob: { date: "1985-04-22T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post1",
          title: "Ethics in Modern Journalism",
          content: "Exploring ethical boundaries of innovative reporting...",
          description:
            "Unveiling moral dilemmas journalists face with new reporting methods.",
          coverImage: `https://picsum.photos/id/101/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 5),
          likes: 4200,
          views: 51000,
          readTime: 7,
          tags: ["Technology", "Ethics", "Journalism"],
          mlInsights: {
            semanticSimilarity: 0.88,
            emotionalTone: "neutral",
            cognitiveComplexity: 85,
            innovationPotential: 92,
            ethicalScore: 89,
          },
          interactionHeatmap: {
            "0-25%": 1200,
            "25-50%": 2500,
            "50-75%": 3800,
            "75-100%": 2300,
          },
          recommendationVector: [0.8, 0.7, 0.9, 0.8],
          aiGeneratedSummary: "Deep dive into modern ethics in journalism",
          geoPosition: [48.1374, 11.5755],
        },
      ],
    },
    {
      id: "editor2",
      name: "Luca Rossi",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Italian data journalist innovating with technology",
      expertise: ["Data Journalism", "AI Tools", "Visualization"],
      followers: 18000,
      aiRank: 88,
      mlProfile: {
        communicationStyle: "Engaging",
        intellectualDiversity: 89,
        innovationCapacity: 90,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+39) 320-987-6543",
        location: {
          street: { number: 45, name: "Via Veneto" },
          city: "Rome",
          state: "Lazio",
          country: "Italy",
          postcode: "00187",
        },
        dob: { date: "1988-09-10T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post2",
          title: "Advanced Data Visualizations",
          content: "Transforming data reporting with modern tools...",
          description:
            "How innovative visuals are reshaping the future of data-driven news.",
          coverImage: `https://picsum.photos/id/104/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 7),
          likes: 2900,
          views: 40000,
          readTime: 6,
          tags: ["Technology", "Data", "Visualization"],
          mlInsights: {
            semanticSimilarity: 0.85,
            emotionalTone: "positive",
            cognitiveComplexity: 83,
            innovationPotential: 89,
            ethicalScore: 86,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.9, 0.8, 0.7, 0.9],
          aiGeneratedSummary:
            "Cutting-edge insights into innovative data visualizations",
          geoPosition: [41.9028, 12.4964],
        },
      ],
    },
    {
      id: "editor3",
      name: "Clara Dubois",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "French investigative journalist using modern tools",
      expertise: ["Investigative Journalism", "AI Tools", "Ethics"],
      followers: 20000,
      aiRank: 90,
      mlProfile: {
        communicationStyle: "Persuasive",
        intellectualDiversity: 88,
        innovationCapacity: 91,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+33) 612-345-678",
        location: {
          street: { number: 29, name: "Rue de Rivoli" },
          city: "Paris",
          state: "Île-de-France",
          country: "France",
          postcode: "75004",
        },
        dob: { date: "1990-07-18T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post3",
          title: "Ethics in Modern Journalism",
          content: "Exploring ethical boundaries of innovative reporting...",
          description:
            "Examining the challenges of maintaining trust in technology-supported newsrooms.",
          coverImage: `https://picsum.photos/id/106/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 5),
          likes: 3100,
          views: 45000,
          readTime: 7,
          tags: ["Technology", "Ethics", "Journalism"],
          mlInsights: {
            semanticSimilarity: 0.88,
            emotionalTone: "neutral",
            cognitiveComplexity: 85,
            innovationPotential: 89,
            ethicalScore: 92,
          },
          interactionHeatmap: {
            "0-25%": 1000,
            "25-50%": 1700,
            "50-75%": 2900,
            "75-100%": 2200,
          },
          recommendationVector: [0.8, 0.7, 0.9, 0.8],
          aiGeneratedSummary: "Deep dive into modern ethics in journalism",
          geoPosition: [48.8566, 2.3522],
        },
      ],
    },
    {
      id: "editor4",
      name: "Elena Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      bio: "Spanish tech journalist and media researcher",
      expertise: ["Technology", "AI", "Innovation"],
      followers: 22000,
      aiRank: 92,
      mlProfile: {
        communicationStyle: "Analytical",
        intellectualDiversity: 90,
        innovationCapacity: 93,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+34) 678-901-234",
        location: {
          street: { number: 15, name: "Calle Gran Vía" },
          city: "Madrid",
          state: "Comunidad de Madrid",
          country: "Spain",
          postcode: "28013",
        },
        dob: { date: "1986-11-03T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post4",
          title: "Technology's Role in Tech Journalism",
          content: "Transforming tech reporting with modern methods...",
          description:
            "Discovering how tech newsrooms adapt to rapid technological trends.",
          coverImage: `https://picsum.photos/id/107/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 7),
          likes: 3500,
          views: 48000,
          readTime: 8,
          tags: ["Technology", "Innovation"],
          mlInsights: {
            semanticSimilarity: 0.9,
            emotionalTone: "positive",
            cognitiveComplexity: 87,
            innovationPotential: 94,
            ethicalScore: 89,
          },
          interactionHeatmap: {
            "0-25%": 1200,
            "25-50%": 1900,
            "50-75%": 3100,
            "75-100%": 2400,
          },
          recommendationVector: [0.9, 0.8, 0.7, 0.9],
          aiGeneratedSummary:
            "Cutting-edge insights into innovative tech journalism",
          geoPosition: [40.4168, -3.7038],
        },
      ],
    },
    {
      id: "editor5",
      name: "Alex Chen",
      avatar: "https://randomuser.me/api/portraits/men/79.jpg",
      bio: "Asian-American media ethics and innovation researcher",
      expertise: ["AI Ethics", "Media Innovation", "Global Perspectives"],
      followers: 19000,
      aiRank: 89,
      mlProfile: {
        communicationStyle: "Balanced",
        intellectualDiversity: 92,
        innovationCapacity: 88,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+1) 415-678-9012",
        location: {
          street: { number: 789, name: "Market Street" },
          city: "San Francisco",
          state: "California",
          country: "United States",
          postcode: "94105",
        },
        dob: { date: "1987-02-28T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post5",
          title: "Global Media Ethics",
          content: "Comparative study of digital ethics in media landscapes...",
          description:
            "Analyzing how global newsrooms navigate modern technological challenges.",
          coverImage: `https://picsum.photos/id/108/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 9),
          likes: 3200,
          views: 42000,
          readTime: 9,
          tags: ["Technology", "Ethics", "Global Media"],
          mlInsights: {
            semanticSimilarity: 0.86,
            emotionalTone: "neutral",
            cognitiveComplexity: 86,
            innovationPotential: 87,
            ethicalScore: 91,
          },
          interactionHeatmap: {
            "0-25%": 1100,
            "25-50%": 1800,
            "50-75%": 3000,
            "75-100%": 2300,
          },
          recommendationVector: [0.8, 0.9, 0.7, 0.8],
          aiGeneratedSummary:
            "Deep exploration of modern ethics in global media contexts",
          geoPosition: [37.7749, -122.4194],
        },
      ],
    },
    {
      id: "editor6",
      name: "Mateusz Nowak",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
      bio: "Polish media policy analyst and editor",
      expertise: ["AI Policy", "Technology", "Ethics"],
      followers: 19000,
      aiRank: 89,
      mlProfile: {
        communicationStyle: "Analytical",
        intellectualDiversity: 88,
        innovationCapacity: 90,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+48) 512-345-678",
        location: {
          street: { number: 10, name: "Marszałkowska" },
          city: "Warsaw",
          state: "Masovian",
          country: "Poland",
          postcode: "00-102",
        },
        dob: { date: "1984-06-12T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post6",
          title: "Media Policies in Eastern Europe",
          content: "Shaping digital regulations in media organizations...",
          description:
            "Investigating the impact of media policies on regional journalism trends.",
          coverImage: `https://picsum.photos/id/114/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 5),
          likes: 3100,
          views: 43000,
          readTime: 7,
          tags: ["Technology", "Policy", "Ethics"],
          mlInsights: {
            semanticSimilarity: 0.9,
            emotionalTone: "neutral",
            cognitiveComplexity: 86,
            innovationPotential: 89,
            ethicalScore: 93,
          },
          interactionHeatmap: {
            "0-25%": 1100,
            "25-50%": 2000,
            "50-75%": 3200,
            "75-100%": 2300,
          },
          recommendationVector: [0.8, 0.7, 0.9, 0.8],
          aiGeneratedSummary:
            "Deep dive into modern policy in Eastern European journalism",
          geoPosition: [52.2297, 21.0122],
        },
      ],
    },
    {
      id: "editor7",
      name: "Isabella Ferrari",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      bio: "Italian environmental journalist using innovative tools",
      expertise: ["Environmental Journalism", "AI Tools", "Climate Tech"],
      followers: 16000,
      aiRank: 86,
      mlProfile: {
        communicationStyle: "Passionate",
        intellectualDiversity: 86,
        innovationCapacity: 88,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+39) 340-123-4567",
        location: {
          street: { number: 8, name: "Calle Dorsoduro" },
          city: "Venice",
          state: "Veneto",
          country: "Italy",
          postcode: "30123",
        },
        dob: { date: "1990-03-25T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post7",
          title: "Innovative Climate Reporting",
          content: "Transforming climate journalism with advanced tools...",
          description:
            "Revealing how climate stories gain depth through modern reporting methods.",
          coverImage: `https://picsum.photos/id/116/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 7),
          likes: 2900,
          views: 41000,
          readTime: 6,
          tags: ["Technology", "Climate", "Journalism"],
          mlInsights: {
            semanticSimilarity: 0.85,
            emotionalTone: "positive",
            cognitiveComplexity: 82,
            innovationPotential: 89,
            ethicalScore: 87,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.9, 0.8, 0.7, 0.9],
          aiGeneratedSummary:
            "Cutting-edge insights into innovative climate reporting",
          geoPosition: [45.4408, 12.3155],
        },
      ],
    },
    {
      id: "editor8",
      name: "Lars Andersen",
      avatar: "https://randomuser.me/api/portraits/men/34.jpg",
      bio: "Danish sports journalist using data analytics",
      expertise: ["Sports Journalism", "AI Analytics", "Data"],
      followers: 15000,
      aiRank: 85,
      mlProfile: {
        communicationStyle: "Dynamic",
        intellectualDiversity: 84,
        innovationCapacity: 86,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+45) 287-654-321",
        location: {
          street: { number: 5, name: "Nørrebrogade" },
          city: "Copenhagen",
          state: "Capital Region",
          country: "Denmark",
          postcode: "2200",
        },
        dob: { date: "1986-08-14T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post8",
          title: "Data-Driven Sports Journalism",
          content: "Enhancing sports reporting with advanced analytics...",
          description:
            "Exploring how data transforms the way sports stories are told.",
          coverImage: `https://picsum.photos/id/119/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 5),
          likes: 2800,
          views: 39000,
          readTime: 6,
          tags: ["Technology", "Sports", "Data"],
          mlInsights: {
            semanticSimilarity: 0.84,
            emotionalTone: "positive",
            cognitiveComplexity: 80,
            innovationPotential: 87,
            ethicalScore: 85,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.8, 0.7, 0.9, 0.8],
          aiGeneratedSummary:
            "Deep dive into technology-driven sports journalism",
          geoPosition: [55.6761, 12.5683],
        },
      ],
    },
    {
      id: "editor9",
      name: "Elena Sánchez",
      avatar: "https://randomuser.me/api/portraits/women/35.jpg",
      bio: "Spanish tech reporter covering innovative startups",
      expertise: ["Technology", "AI Startups", "Innovation"],
      followers: 18000,
      aiRank: 88,
      mlProfile: {
        communicationStyle: "Informative",
        intellectualDiversity: 87,
        innovationCapacity: 90,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+34) 655-789-012",
        location: {
          street: { number: 22, name: "Calle de Alcalá" },
          city: "Seville",
          state: "Andalusia",
          country: "Spain",
          postcode: "41001",
        },
        dob: { date: "1989-12-05T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post9",
          title: "Innovative Startups in Media",
          content: "Exploring digital innovation in media startups...",
          description:
            "Spotlighting emerging companies revolutionizing news with new technology.",
          coverImage: `https://picsum.photos/id/121/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 7),
          likes: 3000,
          views: 42000,
          readTime: 7,
          tags: ["AI", "Startups", "Innovation"],
          mlInsights: {
            semanticSimilarity: 0.89,
            emotionalTone: "positive",
            cognitiveComplexity: 84,
            innovationPotential: 91,
            ethicalScore: 88,
          },
          interactionHeatmap: {
            "0-25%": 1000,
            "25-50%": 1900,
            "50-75%": 3100,
            "75-100%": 2200,
          },
          recommendationVector: [0.9, 0.8, 0.7, 0.9],
          aiGeneratedSummary:
            "Cutting-edge insights into innovative startups in media",
          geoPosition: [37.3891, -5.9845],
        },
      ],
    },
    {
      id: "editor10",
      name: "Hugo Berg",
      avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      bio: "Swedish data scientist and journalist",
      expertise: ["Data Science", "AI Tools", "Journalism"],
      followers: 17000,
      aiRank: 87,
      mlProfile: {
        communicationStyle: "Analytical",
        intellectualDiversity: 86,
        innovationCapacity: 89,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+46) 70-123-4567",
        location: {
          street: { number: 18, name: "Drottninggatan" },
          city: "Stockholm",
          state: "Stockholm County",
          country: "Sweden",
          postcode: "11151",
        },
        dob: { date: "1987-10-30T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post10",
          title: "Advanced Data Journalism",
          content: "Leveraging modern tools for data-driven stories...",
          description:
            "Uncovering hidden patterns in news through advanced data analysis.",
          coverImage: `https://picsum.photos/id/124/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 5),
          likes: 2900,
          views: 41000,
          readTime: 6,
          tags: ["Technology", "Data", "Journalism"],
          mlInsights: {
            semanticSimilarity: 0.86,
            emotionalTone: "positive",
            cognitiveComplexity: 83,
            innovationPotential: 90,
            ethicalScore: 87,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.8, 0.7, 0.9, 0.8],
          aiGeneratedSummary: "Deep dive into innovative data journalism",
          geoPosition: [59.3293, 18.0686],
        },
      ],
    },
    {
      id: "editor11",
      name: "Marie Lefèvre",
      avatar: "https://randomuser.me/api/portraits/women/37.jpg",
      bio: "French multimedia storyteller with digital focus",
      expertise: ["Multimedia", "AI Tools", "Storytelling"],
      followers: 16000,
      aiRank: 86,
      mlProfile: {
        communicationStyle: "Creative",
        intellectualDiversity: 85,
        innovationCapacity: 88,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+33) 689-012-345",
        location: {
          street: { number: 7, name: "Avenue des Champs-Élysées" },
          city: "Nice",
          state: "Provence-Alpes-Côte d'Azur",
          country: "France",
          postcode: "06000",
        },
        dob: { date: "1991-01-15T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post11",
          title: "Enhanced Multimedia Storytelling",
          content: "Creating immersive narratives with modern tools...",
          description:
            "Crafting engaging stories with cutting-edge multimedia techniques.",
          coverImage: `https://picsum.photos/id/126/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 7),
          likes: 2800,
          views: 39000,
          readTime: 6,
          tags: ["Technology", "Multimedia", "Storytelling"],
          mlInsights: {
            semanticSimilarity: 0.84,
            emotionalTone: "positive",
            cognitiveComplexity: 81,
            innovationPotential: 89,
            ethicalScore: 86,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.9, 0.8, 0.7, 0.9],
          aiGeneratedSummary:
            "Cutting-edge insights into innovative storytelling",
          geoPosition: [43.7102, 7.262],
        },
      ],
    },
    {
      id: "editor12",
      name: "Thomas Becker",
      avatar: "https://randomuser.me/api/portraits/men/38.jpg",
      bio: "German investigative journalist using advanced tools",
      expertise: ["Investigative Journalism", "AI Tools", "Data Analysis"],
      followers: 19000,
      aiRank: 89,
      mlProfile: {
        communicationStyle: "Direct",
        intellectualDiversity: 87,
        innovationCapacity: 90,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+49) 171-890-1234",
        location: {
          street: { number: 33, name: "Königsallee" },
          city: "Hamburg",
          state: "Hamburg",
          country: "Germany",
          postcode: "20249",
        },
        dob: { date: "1985-09-08T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post12",
          title: "Advanced Investigative Journalism",
          content: "Uncovering stories with modern analytics...",
          description:
            "How advanced tools help expose hidden truths in complex investigations.",
          coverImage: `https://picsum.photos/id/129/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 5),
          likes: 3100,
          views: 43000,
          readTime: 7,
          tags: ["Technology", "Investigative", "Data"],
          mlInsights: {
            semanticSimilarity: 0.89,
            emotionalTone: "neutral",
            cognitiveComplexity: 85,
            innovationPotential: 90,
            ethicalScore: 92,
          },
          interactionHeatmap: {
            "0-25%": 1100,
            "25-50%": 2000,
            "50-75%": 3200,
            "75-100%": 2300,
          },
          recommendationVector: [0.8, 0.7, 0.9, 0.8],
          aiGeneratedSummary: "Deep dive into modern investigative journalism",
          geoPosition: [53.5511, 9.9937],
        },
      ],
    },
    {
      id: "editor13",
      name: "Sofia Almeida",
      avatar: "https://randomuser.me/api/portraits/women/39.jpg",
      bio: "Portuguese tech journalist covering innovation",
      expertise: ["Technology", "AI Tools", "Innovation"],
      followers: 17000,
      aiRank: 87,
      mlProfile: {
        communicationStyle: "Informative",
        intellectualDiversity: 86,
        innovationCapacity: 89,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+351) 912-345-678",
        location: {
          street: { number: 9, name: "Avenida da Liberdade" },
          city: "Lisbon",
          state: "Lisbon District",
          country: "Portugal",
          postcode: "1250-096",
        },
        dob: { date: "1988-04-20T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post13",
          title: "Digital Media Innovation",
          content: "Adopting modern tools in media innovation...",
          description:
            "Exploring the next frontier of newsroom technological advancements.",
          coverImage: `https://picsum.photos/id/132/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 7),
          likes: 2900,
          views: 41000,
          readTime: 6,
          tags: ["Technology", "Media", "Innovation"],
          mlInsights: {
            semanticSimilarity: 0.86,
            emotionalTone: "positive",
            cognitiveComplexity: 83,
            innovationPotential: 90,
            ethicalScore: 87,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.9, 0.8, 0.7, 0.9],
          aiGeneratedSummary:
            "Cutting-edge insights into innovative media innovation",
          geoPosition: [38.7223, -9.1393],
        },
      ],
    },
    {
      id: "editor14",
      name: "Freya Olsen",
      avatar: "https://randomuser.me/api/portraits/women/40.jpg",
      bio: "Norwegian environmental journalist using modern tools",
      expertise: ["Environmental Journalism", "AI Tools", "Climate Tech"],
      followers: 16000,
      aiRank: 86,
      mlProfile: {
        communicationStyle: "Passionate",
        intellectualDiversity: 85,
        innovationCapacity: 88,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+47) 912-345-678",
        location: {
          street: { number: 14, name: "Storgata" },
          city: "Oslo",
          state: "Oslo",
          country: "Norway",
          postcode: "0184",
        },
        dob: { date: "1990-06-27T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post14",
          title: "Innovative Environmental Journalism",
          content: "Tracking climate issues with advanced tools...",
          description:
            "Highlighting climate challenges through innovative reporting methods.",
          coverImage: `https://picsum.photos/id/134/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 5),
          likes: 2800,
          views: 39000,
          readTime: 6,
          tags: ["Technology", "Climate", "Journalism"],
          mlInsights: {
            semanticSimilarity: 0.85,
            emotionalTone: "positive",
            cognitiveComplexity: 82,
            innovationPotential: 89,
            ethicalScore: 87,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.8, 0.7, 0.9, 0.8],
          aiGeneratedSummary:
            "Deep dive into innovative environmental journalism",
          geoPosition: [59.9139, 10.7522],
        },
      ],
    },
    {
      id: "editor15",
      name: "Giorgio Conti",
      avatar: "https://randomuser.me/api/portraits/men/41.jpg",
      bio: "Italian science communicator using modern tools",
      expertise: ["Science Journalism", "AI Tools", "Communication"],
      followers: 16000,
      aiRank: 86,
      mlProfile: {
        communicationStyle: "Engaging",
        intellectualDiversity: 85,
        innovationCapacity: 88,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+39) 333-456-7890",
        location: {
          street: { number: 20, name: "Via Monte Napoleone" },
          city: "Milan",
          state: "Lombardy",
          country: "Italy",
          postcode: "20121",
        },
        dob: { date: "1989-08-16T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post15",
          title: "Modern Science Communication",
          content: "Simplifying science with advanced tools...",
          description:
            "Making complex scientific concepts accessible through modern tools.",
          coverImage: `https://picsum.photos/id/137/800/600`,
          createdAt: new Date(Date.now() - 86400000 * 7),
          likes: 2900,
          views: 40000,
          readTime: 6,
          tags: ["Technology", "Science", "Communication"],
          mlInsights: {
            semanticSimilarity: 0.85,
            emotionalTone: "positive",
            cognitiveComplexity: 82,
            innovationPotential: 89,
            ethicalScore: 87,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.9, 0.8, 0.7, 0.9],
          aiGeneratedSummary:
            "Cutting-edge insights into innovative science communication",
          geoPosition: [45.4642, 9.19],
        },
      ],
    },
    {
      id: "editor16",
      name: "Elon Fusk",
      avatar: "https://randomuser.me/api/portraits/men/68.jpg",
      bio: "American science communicator using technology",
      expertise: ["Science Journalism", "AI Tools", "Communication"],
      followers: 16000,
      aiRank: 86,
      mlProfile: {
        communicationStyle: "Engaging",
        intellectualDiversity: 85,
        innovationCapacity: 88,
      },
      personalInfo: {
        email: "[email protected]",
        phone: "(+1) 312-567-8901",
        location: {
          street: { number: 101, name: "Michigan Avenue" },
          city: "Chicago",
          state: "Illinois",
          country: "United States",
          postcode: "60611",
        },
        dob: { date: "1987-05-09T00:00:00.000Z" },
      },
      posts: [
        {
          id: "post16",
          title: "Genesis of Learning in Science Communication",
          content:
            "Cutting-edge insights into technology-driven science communication",
          description:
            "Bridging science and public understanding with innovative approaches.",
          coverImage: `https://picsum.photos/seed/picsum/200/300`,
          createdAt: new Date(Date.now() - 86400000 * 7),
          likes: 3900,
          views: 50000,
          readTime: 6,
          tags: ["Technology", "Science", "Communication"],
          mlInsights: {
            semanticSimilarity: 0.85,
            emotionalTone: "positive",
            cognitiveComplexity: 82,
            innovationPotential: 89,
            ethicalScore: 87,
          },
          interactionHeatmap: {
            "0-25%": 900,
            "25-50%": 1600,
            "50-75%": 2800,
            "75-100%": 2000,
          },
          recommendationVector: [0.9, 0.8, 0.7, 0.9],
          aiGeneratedSummary:
            "Cutting-edge insights into technology-driven science communication",
          geoPosition: [41.8781, -87.6298],
        },
      ],
    },
  ];

  try {
    const editors: User[] = mockEditors.map((editor, index) => {
      try {
        return UserSchema.parse({
          id: editor.id,
          name: editor.name,
          avatar: editor.avatar,
          bio: editor.bio,
          expertise: editor.expertise,
          followers: editor.followers,
          aiRank: editor.aiRank,
          mlProfile: editor.mlProfile,
          personalInfo: editor.personalInfo,
        });
      } catch (e) {
        console.error(`Error parsing editor ${index + 1} (${editor.name}):`, e);
        throw e;
      }
    });

    const posts: EditorPost[] = mockEditors
      .flatMap((editor, editorIndex) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        editor.posts.map((post: any, postIndex: number) => {
          try {
            return {
              id: post.id,
              title: post.title,
              content: post.content,
              description: post.description,
              coverImage: post.coverImage,
              createdAt: post.createdAt,
              likes: post.likes,
              views: post.views,
              readTime: post.readTime,
              tags: post.tags,
              mlInsights: post.mlInsights,
              interactionHeatmap: post.interactionHeatmap,
              recommendationVector: post.recommendationVector,
              aiGeneratedSummary: post.aiGeneratedSummary,
              geoPosition: post.geoPosition,
              editorId: editor.id,
              editorName: editor.name,
              editorAvatar: editor.avatar,
            };
          } catch (e) {
            console.error(
              `Error preparing post ${postIndex + 1} for editor ${
                editorIndex + 1
              } (${editor.name}):`,
              post,
              e
            );
            throw e;
          }
        })
      )
      .map((post, index) => {
        try {
          return EditorPostSchema.parse(post);
        } catch (e) {
          console.error(`Error parsing post ${index + 1}:`, post, e);
          throw e;
        }
      });

    return { editors, posts };
  } catch (e) {
    console.error("Failed to generate mock editors:", e);
    throw e;
  }
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  isOpen,
  onClose,
  editor,
}) => {
  if (!isOpen || !editor) return null;

  const { personalInfo } = editor;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-6 rounded-lg shadow-lg max-w-md w-full bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-white">{editor.name}</h2>
        <div className="space-y-2 text-gray-500">
          <p>
            <strong>Email:</strong> {personalInfo.email}
          </p>
          <p>
            <strong>Phone:</strong> {personalInfo.phone}
          </p>
          <p>
            <strong>Address:</strong> {personalInfo.location.street.number}{" "}
            {personalInfo.location.street.name}, {personalInfo.location.city},{" "}
            {personalInfo.location.state}, {personalInfo.location.country},{" "}
            {personalInfo.location.postcode}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(personalInfo.dob.date).toLocaleDateString()}
          </p>
        </div>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditorList: React.FC<EditorListProps> = ({ editors }) => {
  const [selectedEditor, setSelectedEditor] = useState<Editor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditorClick = (editor: Editor) => {
    setSelectedEditor(editor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEditor(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {editors.map((editor) => (
        <div
          key={editor.id}
          className="p-4 border rounded-lg cursor-pointer hover:shadow-md bg-gray-800"
          onClick={() => handleEditorClick(editor)}
        >
          <Image
            src={editor.avatar}
            alt={editor.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full"
          />
          <h3 className="text-lg font-semibold text-white">{editor.name}</h3>
          <p className="text-sm text-gray-500">{editor.bio}</p>
        </div>
      ))}
      <PersonalInfoCard
        isOpen={isModalOpen}
        onClose={closeModal}
        editor={selectedEditor}
      />
    </div>
  );
};

const OptimizedEditorCard = React.memo(
  ({
    editor,
    onFollow,
    onSelect,
  }: {
    editor: User;
    onFollow: (id: string) => void;
    onSelect: (id: string) => void;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-64 min-w-[16rem] snap-center"
        onClick={() => onSelect(editor.id)}
      >
        <Card className="h-full flex flex-col cursor-pointer hover:shadow-xl transition-shadow">
          <CardHeader className="flex justify-center pb-0">
            <Image
              src={editor.avatar}
              alt={editor.name}
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <CardTitle className="text-lg line-clamp-2 text-white">
              {editor.name}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2 mt-2">
              {editor.bio}
            </CardDescription>
            <div className="flex justify-between w-full text-sm text-muted-foreground mt-2">
              <span>{editor.followers} Followers</span>
              <span>AI Rank: {editor.aiRank}</span>
            </div>
          </CardContent>
          <CardFooter className="justify-center pt-0">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onFollow(editor.id);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Follow
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);
OptimizedEditorCard.displayName = "OptimizedEditorCard";

const OpenChannelPage = () => {
  const [posts, setPosts] = useState<EditorPost[]>([]);
  const [editors, setEditors] = useState<User[]>([]);
  const [selectedEditorId, setSelectedEditorId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<EditorPost | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag.toLowerCase()));
    });
    return [...tagsSet].sort();
  }, [posts]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const { editors: mockEditors, posts } = generateAdvancedMockEditors();
        setEditors([...mockEditors].sort((a, b) => b.followers - a.followers));
        setPosts(posts);
      } catch (error) {
        console.error("Advanced loading failed", error);
        toast.error("ML Processing Error", {
          description: "Unable to extract advanced insights",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isHovering || !carouselRef.current || editors.length === 0) return;

    const cardWidth = 5 * 256 + 4 * 16;
    const interval = setInterval(() => {
      const container = carouselRef.current;
      if (!container) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "instant" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering, editors.length]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const cardWidth = 5 * 256 + 4 * 16;
      carouselRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const cardWidth = 5 * 256 + 4 * 16;
      carouselRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const handleFollowEditor = (editorId: string) => {
    setEditors((prev) =>
      prev.map((editor) =>
        editor.id === editorId
          ? { ...editor, followers: editor.followers + 1 }
          : editor
      )
    );
    toast.success("Editor followed");
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.editorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags =
        filterTags.length === 0 ||
        post.tags.some((tag) => filterTags.includes(tag.toLowerCase()));
      return matchesSearch && matchesTags;
    });
  }, [posts, searchQuery, filterTags]);

  const handleTagFilter = (tags: string | string[]) => {
    if (Array.isArray(tags)) {
      setFilterTags(tags.map((tag) => tag.toLowerCase()));
    } else {
      setFilterTags([...filterTags, tags.toLowerCase()]);
    }
  };

  const clearFilters = () => {
    setFilterTags([]);
    setSearchQuery("");
  };

  const selectedEditorPosts = useMemo(() => {
    if (!selectedEditorId) return [];
    return posts.filter((post) => post.editorId === selectedEditorId);
  }, [selectedEditorId, posts]);

  const selectedEditor = useMemo(() => {
    if (!selectedEditorId) return null;
    return editors.find((editor) => editor.id === selectedEditorId) || null;
  }, [selectedEditorId, editors]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-white overflow-x-hidden"
    >
      <header className="relative h-[60vh] w-full overflow-hidden mb-4">
        <Canvas className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.7} />
          <Environment preset="night" />
          <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
            <AIEnhancedEditorGlobe />
          </Float>
          <OrbitControls
            autoRotate={true}
            autoRotateSpeed={0.5}
            enableZoom={false}
          />
        </Canvas>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-10 z-10">
          <motion.h1
            className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Open Channel
          </motion.h1>
          <motion.p
            className="mt-2 text-sm sm:text-base text-gray-300 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore Cognitive Media Insights
          </motion.p>
          <motion.div
            className="mt-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-xs sm:text-sm text-gray-300">
              Crafted by Dedicated Newsrooms
            </span>
          </motion.div>
        </div>
      </header>

      <section className="container mx-auto py-16 px-6 overflow-x-hidden">
        <div className="flex flex-col md:flex-row gap-4 mb-24 items-center max-w-3xl mx-auto">
          <Input
            placeholder="Search posts by title or editor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md w-full bg-gray-700 text-white border-gray-600 rounded-full focus:ring-blue-500"
          />
          <Select
            value={filterTags[0] || ""}
            onValueChange={(value) => {
              if (value && !filterTags.includes(value.toLowerCase()))
                handleTagFilter([...filterTags, value.toLowerCase()]);
            }}
          >
            <SelectTrigger className="bg-gray-700 text-white border-gray-600 rounded-full focus:ring-blue-500">
              <SelectValue placeholder="Select tags to filter" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              {uniqueTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center gap-2 bg-gray-700 text-white border-gray-600 hover:bg-gray-600 rounded-full"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        </div>
        {filterTags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8 max-w-3xl mx-auto">
            {filterTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-center text-xs bg-blue-600 text-white rounded-full px-2 py-1 cursor-pointer"
                onClick={() =>
                  setFilterTags(filterTags.filter((t) => t !== tag))
                }
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                <X className="w-3 h-3" />
              </span>
            ))}
          </div>
        )}
        <h3 className="text-3xl font-bold mb-8 text-center">
          Recommended Editors
        </h3>
        {isLoading ? (
          <p className="text-center text-gray-300">Loading editors...</p>
        ) : editors.length > 0 ? (
          <div className="relative max-w-[1360px] mx-auto">
            <Button
              onClick={scrollLeft}
              className="absolute -left-12 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-blue-600 text-white rounded-full p-2 z-10 shadow-md"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div
              ref={carouselRef}
              className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar gap-4 px-4"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {editors.map((editor) => (
                <OptimizedEditorCard
                  key={editor.id}
                  editor={editor}
                  onFollow={handleFollowEditor}
                  onSelect={setSelectedEditorId}
                />
              ))}
            </div>
            <Button
              onClick={scrollRight}
              className="absolute -right-12 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-blue-600 text-white rounded-full p-2 z-10 shadow-md"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        ) : (
          <p className="text-center text-gray-300">No editors available.</p>
        )}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      <section className="container mx-auto py-16 px-6 overflow-hidden">
        <h3 className="text-3xl font-bold mb-8 text-center text-white">
          Editor&apos;s Choice
        </h3>
        {isLoading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedPost(post)}
                >
                  <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <Image
                        src={post.coverImage}
                        alt={post.description}
                        width={640}
                        height={400}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    </CardHeader>
                    <CardContent className="flex flex-col flex-grow pt-4">
                      <CardTitle className="text-lg line-clamp-1 text-white">
                        {post.title}
                      </CardTitle>
                      <p
                        className="text-xs text-blue-600 cursor-pointer hover:underline mt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEditorId(post.editorId);
                        }}
                      >
                        By {post.editorName}
                      </p>
                      <CardDescription className="text-sm line-clamp-2 mt-2">
                        {post.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-0">
                      <span className="text-xs font-semibold">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {postNumber(post.likes)}
                      </span>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-300">
                No posts match your filters.
              </p>
            )}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedEditor && (
          <Dialog
            open={!!selectedEditor}
            onOpenChange={() => setSelectedEditorId(null)}
          >
            <DialogContent className="max-w-lg text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {selectedEditor.name}
                </DialogTitle>
              </DialogHeader>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center mb-6 w-full">
                  <Image
                    src={selectedEditor.avatar}
                    alt={selectedEditor.name}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                  <div className="text-gray-400 max-w-full">
                    <p>
                      <strong>Name:</strong> {selectedEditor.name}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedEditor.personalInfo.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedEditor.personalInfo.phone}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedEditor.personalInfo.location.street.number}{" "}
                      {selectedEditor.personalInfo.location.street.name},{" "}
                      {selectedEditor.personalInfo.location.city},{" "}
                      {selectedEditor.personalInfo.location.state},{" "}
                      {selectedEditor.personalInfo.location.country},{" "}
                      {selectedEditor.personalInfo.location.postcode}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {new Date(
                        selectedEditor.personalInfo.dob.date
                      ).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {selectedEditorPosts.length} Post(s)
                    </p>
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-4 text-white">
                  Recent Posts
                </h4>
                <div className="space-y-4 w-full">
                  {selectedEditorPosts.map((post: EditorPost) => (
                    <DialogTrigger
                      asChild
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                    >
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardHeader className="p-0">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              width={320}
                              height={128}
                              className="w-full h-32 object-cover rounded-t-md"
                            />
                          </CardHeader>
                          <CardContent className="pt-4">
                            <CardTitle className="text-md text-white">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="text-sm line-clamp-2 mt-2">
                              {post.content}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-0">
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              {postNumber(post.likes)}
                            </span>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    </DialogTrigger>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPost && (
          <Dialog
            open={!!selectedPost}
            onOpenChange={() => setSelectedPost(null)}
          >
            <DialogContent className="max-w-md w-full text-white">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle>{selectedPost.title}</CardTitle>
                  <span
                    className="text-sm text-blue-500 cursor-pointer"
                    onClick={() => setSelectedEditorId(selectedPost.editorId)}
                  >
                    By {selectedPost.editorName}
                  </span>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm">{selectedPost.content}</p>
                  <div>
                    <h5 className="text-sm font-semibold mb-2">
                      Generated {selectedPost.aiGeneratedSummary}
                    </h5>
                  </div>
                  <div>
                    <h5 className="text-md font-semibold mb-2">Geolocation</h5>
                    <p className="text-sm text-muted-foreground">
                      Latitude: {selectedPost.geoPosition[0]}, Longitude:{" "}
                      {selectedPost.geoPosition[1]}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-md font-semibold mb-2">ML Insights</h5>
                    <MLInsightsChart insights={selectedPost.mlInsights} />
                  </div>
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OpenChannelPage;
