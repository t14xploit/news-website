import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Share2, User, Award } from "lucide-react";

interface EditorProfileMetadata {
  name: string;
  expertise: string[];
  aiRank?: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
  };
}

interface EditorProfileModelProps {
  image?: string | null;
  size?: number;
  metadata?: EditorProfileMetadata;
  interactive?: boolean;
}

const EditorProfileModel: React.FC<EditorProfileModelProps> = ({
  image,
  size = 100,
  metadata,
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeInteraction, setActiveInteraction] = useState<
    "default" | "details" | "social"
  >("default");
  const profileRef = useRef<HTMLDivElement>(null);

  const generateImageGradient = useMemo(() => {
    const colors = [
      "from-blue-500",
      "to-purple-600",
      "from-green-400",
      "to-blue-600",
      "from-pink-500",
      "to-red-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!profileRef.current || !isHovered) return;

      const rect = profileRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      profileRef.current.style.transform = `
        perspective(1000px) 
        rotateX(${y * 10}deg) 
        rotateY(${-x * 10}deg)
      `;
    };

    if (isHovered) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered]);

  const renderSocialLinks = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center space-x-4"
    >
      {metadata?.socialLinks?.twitter && (
        <motion.a
          href={metadata.socialLinks.twitter}
          target="_blank"
          whileHover={{ scale: 1.2 }}
        >
          <Share2 className="w-6 h-6 text-white" />
        </motion.a>
      )}
      {metadata?.socialLinks?.linkedin && (
        <motion.a
          href={metadata.socialLinks.linkedin}
          target="_blank"
          whileHover={{ scale: 1.2 }}
        >
          <User className="w-6 h-6 text-white" />
        </motion.a>
      )}
    </motion.div>
  );

  const renderDetailOverlay = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 bg-black/80 rounded-full p-4 overflow-hidden"
    >
      <div className="text-center">
        <h3 className="text-sm font-bold text-white mb-1">
          {metadata?.name || "Anonymous Editor"}
        </h3>
        {metadata?.aiRank && (
          <div className="flex items-center justify-center mb-2">
            <Award className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-xs text-gray-300">
              AI Rank: {metadata.aiRank}
            </span>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-1">
          {metadata?.expertise?.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      ref={profileRef}
      className="relative inline-block transition-all duration-300"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        setActiveInteraction("default");
      }}
      initial={{ scale: 1 }}
      whileHover={interactive ? { scale: 1.1 } : {}}
    >
      <motion.div
        className={`
          rounded-full 
          overflow-hidden 
          shadow-2xl 
          bg-gradient-to-r 
          ${generateImageGradient}
          p-1
        `}
        animate={{
          boxShadow: isHovered
            ? "0 0 0 5px rgba(59, 130, 246, 0.5)"
            : "0 0 0 0px rgba(59, 130, 246, 0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={image || "https://placehold.co/100x100?text=Editor"}
          alt="Editor Profile"
          width={size}
          height={size}
          className="object-cover rounded-full"
          priority
        />
      </motion.div>

      <AnimatePresence>
        {isHovered && interactive && (
          <>
            {activeInteraction === "social" && renderSocialLinks()}
            {activeInteraction === "details" && renderDetailOverlay()}

            {activeInteraction === "default" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 
                flex space-x-2"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setActiveInteraction("details")}
                  className="bg-blue-500/70 text-white text-xs px-2 py-1 rounded-md flex items-center"
                >
                  <Zap className="w-3 h-3 mr-1" /> Details
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setActiveInteraction("social")}
                  className="bg-purple-500/70 text-white text-xs px-2 py-1 rounded-md flex items-center"
                >
                  <Share2 className="w-3 h-3 mr-1" /> Connect
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditorProfileModel;
