"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface SearchStat {
    query: string;
    count: number;
    lastSearched: number;
}

interface PopularSearchesProps {
    popularSearches: SearchStat[];
    recentSearches?: SearchStat[];
    onSearchClick: (query: string) => void;
    className?: string;
}

export function PopularSearches({
    popularSearches,
    recentSearches,
    onSearchClick,
    className,
}: PopularSearchesProps) {
    // Don't render if no data
    if (popularSearches.length === 0 && (!recentSearches || recentSearches.length === 0)) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn("space-y-4", className)}
        >
            {/* Popular Searches */}
            {popularSearches.length > 0 && (
                <div className="bg-slate-900/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-300">
                            Trending Searches
                        </span>
                        <Sparkles className="w-3 h-3 text-yellow-400/50" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {popularSearches.map((stat) => (
                            <motion.button
                                key={stat.query}
                                onClick={() => onSearchClick(stat.query)}
                                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-yellow-500/30 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-sm text-white capitalize group-hover:text-yellow-400 transition-colors">
                                    {stat.query}
                                </span>
                                <span className="text-xs text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded-full">
                                    {stat.count}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Searches */}
            {recentSearches && recentSearches.length > 0 && (
                <div className="bg-slate-900/30 backdrop-blur-sm border border-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-slate-300">
                            Recent Searches
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {recentSearches.map((stat) => (
                            <motion.button
                                key={stat.query}
                                onClick={() => onSearchClick(stat.query)}
                                className="group px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-blue-500/30 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-sm text-white capitalize group-hover:text-blue-400 transition-colors">
                                    {stat.query}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
