import { motion } from "framer-motion";

export function NewsCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg relative"
    >
      <motion.div
        className="bg-gray-700 h-48 w-full"
        animate={{
          background: [
            "linear-gradient(90deg, #374151 0%, #4B5563 50%, #374151 100%)",
            "linear-gradient(90deg, #4B5563 0%, #374151 50%, #4B5563 100%)",
          ],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>

        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>

        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-700 rounded w-1/5"></div>
          <div className="h-8 bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
          ],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />
    </motion.div>
  );
}

export default NewsCardSkeleton;
