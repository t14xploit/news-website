import React, { useRef, useEffect } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { Cpu, Zap, Layers, Rocket } from "lucide-react";

type SkeletonVariant = "loading" | "error" | "processing";

const EditorProfileSkeleton: React.FC<{ variant?: SkeletonVariant }> = ({
  variant = "loading",
}) => {
  const controls = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const skeletonVariants: Variants = {
    loading: {
      opacity: [0.6, 1, 0.6],
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    error: {
      backgroundColor: "#ff000020",
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 0.5,
      },
    },
    processing: {
      backgroundImage: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 300;

    let particleArray: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `rgba(79, 175, 239, ${Math.random()})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function handleParticles() {
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
      }
    }

    function init() {
      particleArray = [];
      for (let i = 0; i < 100; i++) {
        particleArray.push(new Particle());
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleParticles();
      requestAnimationFrame(animate);
    }

    init();
    animate();
  }, []);

  React.useEffect(() => {
    controls.start(variant);
  }, [variant, controls]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      variants={skeletonVariants}
      className="relative flex flex-col items-center justify-center 
      min-h-screen bg-slate-900 text-white overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" />

      <div className="relative z-10 flex flex-col items-center space-y-6">
        <motion.div
          className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
          rounded-full relative overflow-hidden"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
            boxShadow: [
              "0 0 0 0px rgba(79, 175, 239, 0.5)",
              "0 0 0 20px rgba(79, 175, 239, 0)",
              "0 0 0 0px rgba(79, 175, 239, 0.5)",
            ],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-24 h-24 bg-slate-800 rounded-full"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.9, 1, 0.9],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          </div>
        </motion.div>

        <div className="text-center space-y-3">
          <motion.div
            className="h-5 w-48 bg-slate-700 rounded"
            animate={{
              width: [120, 200, 120],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
          <motion.div
            className="h-4 w-36 bg-slate-700 rounded"
            animate={{
              width: [100, 160, 100],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        </div>

        <motion.div
          className="flex space-x-4 text-white/70"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <Cpu className="w-6 h-6 animate-pulse" />
          <Zap className="w-6 h-6 animate-ping" />
          <Layers className="w-6 h-6 animate-bounce" />
        </motion.div>

        <p className="text-sm text-white/70 flex items-center space-x-2">
          <Rocket className="w-4 h-4 mr-2" />
          Initializing Intelligent Profile Engine...
        </p>
      </div>
    </motion.div>
  );
};

export default EditorProfileSkeleton;
