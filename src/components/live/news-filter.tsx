"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, RefreshCw, Sliders } from "lucide-react";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "../multiple-selector";

// export function useDebounce<T>(value: T, delay: number): T {
//   const [debouncedValue, setDebouncedValue] = useState<T>(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// }

interface NewsFilterProps {
  onFilterChange: (filters: {
    category?: string;
    searchQuery?: string;
    sentiment?: string;
  }) => void;
  currentFilters: {
    category: string | null;
    searchQuery: string;
    sentiment: string | null;
  };
}

export default function NewsFilter({
  onFilterChange,
  currentFilters,
}: NewsFilterProps) {
  const [localFilters, setLocalFilters] = useState({
    category: currentFilters.category || "",
    searchQuery: currentFilters.searchQuery || "",
    sentiment: currentFilters.sentiment || "",
  });

  const debouncedSearchQuery = useDebounce(localFilters.searchQuery, 500);

  useEffect(() => {
    onFilterChange(localFilters);
  }, [
    debouncedSearchQuery,
    localFilters,
    localFilters.category,
    localFilters.sentiment,
    onFilterChange,
  ]);

  const handleResetFilters = () => {
    setLocalFilters({
      category: "",
      searchQuery: "",
      sentiment: "",
    });
  };

  const hasActiveFilters =
    localFilters.category || localFilters.searchQuery || localFilters.sentiment;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="flex flex-wrap items-center space-x-2 mb-6">
        <div className="flex-grow relative">
          <Input
            placeholder="Search news globally..."
            value={localFilters.searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocalFilters((prev) => ({
                ...prev,
                searchQuery: e.target.value,
              }))
            }
            className="pl-10 pr-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

          {localFilters.searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() =>
                setLocalFilters((prev) => ({ ...prev, searchQuery: "" }))
              }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        <Select
          value={localFilters.category}
          onValueChange={(value) =>
            setLocalFilters((prev) => ({
              ...prev,
              category: value,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {[
              "global",
              "technology",
              "politics",
              "science",
              "entertainment",
              "health",
              "sports",
            ].map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={localFilters.sentiment}
          onValueChange={(value) =>
            setLocalFilters((prev) => ({
              ...prev,
              sentiment: value,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            {["positive", "negative", "neutral", "controversial"].map(
              (sentiment) => (
                <SelectItem key={sentiment} value={sentiment}>
                  {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center space-x-2"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleResetFilters}
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 text-sm text-gray-400 flex items-center"
          >
            <Sliders className="mr-2 w-4 h-4" />
            Active Filters:
            {localFilters.category && ` ${localFilters.category}`}
            {localFilters.sentiment && ` ${localFilters.sentiment}`}
            {localFilters.searchQuery && ` "${localFilters.searchQuery}"`}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
