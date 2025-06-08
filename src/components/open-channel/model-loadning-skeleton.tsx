import { motion } from "framer-motion";

export function ModelLoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-screen flex items-center justify-center bg-slate-900"
    >
      <div className="relative w-64 h-64">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="w-32 h-32 bg-slate-500 rounded-full"
              animate={{
                opacity: [0.5, 1, 0.5],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center w-full">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="text-sm text-white/70"
          >
            Loading Open Channel...
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export default ModelLoadingSkeleton;
