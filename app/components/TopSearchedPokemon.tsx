"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";

interface SearchStat {
    query: string;
    count: number;
    lastSearched: number;
}

interface TopSearchedPokemonProps {
    topSearches: SearchStat[];
    allPokemons: {
        id: string;
        name: string;
        image: string;
        types: string[];
        number: string;
    }[];
    onPokemonClick?: (name: string) => void;
    className?: string;
}

// Premium gradient colors for ranks
const rankGradients = [
    "from-yellow-300 via-yellow-500 to-amber-600",   // #1 Gold
    "from-slate-200 via-slate-400 to-slate-500",     // #2 Silver
    "from-amber-500 via-amber-600 to-amber-800",     // #3 Bronze
    "from-blue-400 via-blue-500 to-blue-700",        // #4
    "from-purple-400 via-purple-500 to-purple-700",  // #5
    "from-pink-400 via-pink-500 to-pink-700",        // #6
    "from-cyan-400 via-cyan-500 to-cyan-700",        // #7
    "from-emerald-400 via-emerald-500 to-emerald-700", // #8
    "from-orange-400 via-orange-500 to-orange-700",  // #9
    "from-rose-400 via-rose-500 to-rose-700",        // #10
];

export function TopSearchedPokemon({
    topSearches,
    allPokemons,
    onPokemonClick,
    className,
}: TopSearchedPokemonProps) {
    if (topSearches.length === 0) return null;

    const topPokemonsWithData = topSearches
        .map((stat) => {
            const pokemon = allPokemons.find(
                (p) => p.name.toLowerCase() === stat.query.toLowerCase()
            );
            return pokemon ? { ...pokemon, searchCount: stat.count } : null;
        })
        .filter(Boolean)
        .slice(0, 10);

    if (topPokemonsWithData.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn("w-full", className)}
        >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-xl border border-yellow-500/30">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Top 10 Trending</h2>
                    <p className="text-slate-400 text-sm">Most searched Pokémon</p>
                </div>
            </div>

            {/* Netflix-style Premium Cards */}
            <div className="relative">
                <div className="flex gap-1 overflow-x-auto pb-4 scrollbar-hide">
                    {topPokemonsWithData.map((pokemon, index) => {
                        if (!pokemon) return null;

                        return (
                            <motion.div
                                key={pokemon.id}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex-shrink-0 relative"
                            >
                                <Link
                                    href={`/pokemon/${pokemon.name.toLowerCase()}`}
                                    onClick={() => onPokemonClick?.(pokemon.name)}
                                    className="group block"
                                >
                                    {/* Container with rank number + card */}
                                    <div className="flex items-end">
                                        {/* Large Rank Number - Netflix Style */}
                                        <div
                                            className={cn(
                                                "text-[120px] leading-none font-black bg-gradient-to-b bg-clip-text text-transparent select-none",
                                                rankGradients[index] || rankGradients[9]
                                            )}
                                            style={{
                                                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                                                WebkitTextStroke: "3px rgba(0,0,0,0.8)",
                                                textShadow: "4px 4px 8px rgba(0,0,0,0.5)",
                                                marginRight: "-20px",
                                                zIndex: 0,
                                            }}
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Pokemon Card */}
                                        <div className="relative w-36 h-52 rounded-xl overflow-hidden bg-gradient-to-b from-slate-800/95 to-slate-900/95 border border-white/10 hover:border-blue-400/60 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/20 z-10">

                                            {/* Pokemon Image */}
                                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-24 group-hover:scale-110 transition-transform duration-300">
                                                <Image
                                                    src={pokemon.image}
                                                    alt={pokemon.name}
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-contain drop-shadow-lg"
                                                />
                                            </div>

                                            {/* Bottom Gradient */}
                                            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

                                            {/* Pokemon Info */}
                                            <div className="absolute bottom-2 left-2 right-2 z-10">
                                                <h3 className="text-white font-bold text-sm capitalize truncate group-hover:text-blue-400 transition-colors">
                                                    {pokemon.name}
                                                </h3>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-slate-500 text-xs font-mono">
                                                        #{pokemon.number}
                                                    </span>
                                                    <span className="text-yellow-400 text-xs font-bold flex items-center gap-0.5">
                                                        <span className="text-[10px]">👁</span> {pokemon.searchCount}
                                                    </span>
                                                </div>
                                                {/* Type Badges */}
                                                <div className="flex gap-1 mt-1.5">
                                                    {pokemon.types.slice(0, 2).map((type) => (
                                                        <span
                                                            key={type}
                                                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-medium"
                                                        >
                                                            {type}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Fade edge */}
                <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none" />
            </div>
        </motion.div>
    );
}
