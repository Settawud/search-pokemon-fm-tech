"use client";

import { motion } from "framer-motion";
import { cn } from "../lib/utils";

// 17 Pokemon Types + "All" option
const POKEMON_TYPES = [
    "All",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Psychic",
    "Ice",
    "Dragon",
    "Dark",
    "Fairy",
    "Fighting",
    "Flying",
    "Poison",
    "Ground",
    "Rock",
    "Bug",
    "Ghost",
    "Steel",
    "Normal",
] as const;

type PokemonType = (typeof POKEMON_TYPES)[number];

// Enhanced type color styles
const typeColors: Record<string, { bg: string; bgSelected: string; text: string; border: string; glow: string }> = {
    All: {
        bg: "bg-gradient-to-r from-blue-500/30 to-purple-500/30",
        bgSelected: "bg-gradient-to-r from-blue-500 to-purple-500",
        text: "text-white",
        border: "border-blue-400/50",
        glow: "shadow-blue-500/40",
    },
    Fire: {
        bg: "bg-red-500/30",
        bgSelected: "bg-red-500",
        text: "text-red-300",
        border: "border-red-400/50",
        glow: "shadow-red-500/40",
    },
    Water: {
        bg: "bg-blue-500/30",
        bgSelected: "bg-blue-500",
        text: "text-blue-300",
        border: "border-blue-400/50",
        glow: "shadow-blue-500/40",
    },
    Grass: {
        bg: "bg-green-500/30",
        bgSelected: "bg-green-500",
        text: "text-green-300",
        border: "border-green-400/50",
        glow: "shadow-green-500/40",
    },
    Electric: {
        bg: "bg-yellow-500/30",
        bgSelected: "bg-yellow-500",
        text: "text-yellow-300",
        border: "border-yellow-400/50",
        glow: "shadow-yellow-500/40",
    },
    Psychic: {
        bg: "bg-pink-500/30",
        bgSelected: "bg-pink-500",
        text: "text-pink-300",
        border: "border-pink-400/50",
        glow: "shadow-pink-500/40",
    },
    Ice: {
        bg: "bg-cyan-500/30",
        bgSelected: "bg-cyan-500",
        text: "text-cyan-300",
        border: "border-cyan-400/50",
        glow: "shadow-cyan-500/40",
    },
    Dragon: {
        bg: "bg-violet-500/30",
        bgSelected: "bg-violet-500",
        text: "text-violet-300",
        border: "border-violet-400/50",
        glow: "shadow-violet-500/40",
    },
    Dark: {
        bg: "bg-slate-500/40",
        bgSelected: "bg-slate-600",
        text: "text-slate-200",
        border: "border-slate-400/50",
        glow: "shadow-slate-500/40",
    },
    Fairy: {
        bg: "bg-pink-400/30",
        bgSelected: "bg-pink-400",
        text: "text-pink-200",
        border: "border-pink-300/50",
        glow: "shadow-pink-400/40",
    },
    Fighting: {
        bg: "bg-orange-500/30",
        bgSelected: "bg-orange-500",
        text: "text-orange-300",
        border: "border-orange-400/50",
        glow: "shadow-orange-500/40",
    },
    Flying: {
        bg: "bg-purple-400/30",
        bgSelected: "bg-purple-400",
        text: "text-purple-200",
        border: "border-purple-300/50",
        glow: "shadow-purple-400/40",
    },
    Poison: {
        bg: "bg-purple-500/30",
        bgSelected: "bg-purple-500",
        text: "text-purple-300",
        border: "border-purple-400/50",
        glow: "shadow-purple-500/40",
    },
    Ground: {
        bg: "bg-amber-600/30",
        bgSelected: "bg-amber-600",
        text: "text-amber-300",
        border: "border-amber-500/50",
        glow: "shadow-amber-500/40",
    },
    Rock: {
        bg: "bg-amber-700/30",
        bgSelected: "bg-amber-700",
        text: "text-amber-400",
        border: "border-amber-600/50",
        glow: "shadow-amber-600/40",
    },
    Bug: {
        bg: "bg-lime-500/30",
        bgSelected: "bg-lime-500",
        text: "text-lime-300",
        border: "border-lime-400/50",
        glow: "shadow-lime-500/40",
    },
    Ghost: {
        bg: "bg-indigo-500/30",
        bgSelected: "bg-indigo-500",
        text: "text-indigo-300",
        border: "border-indigo-400/50",
        glow: "shadow-indigo-500/40",
    },
    Steel: {
        bg: "bg-slate-400/30",
        bgSelected: "bg-slate-400",
        text: "text-slate-200",
        border: "border-slate-300/50",
        glow: "shadow-slate-400/40",
    },
    Normal: {
        bg: "bg-zinc-500/30",
        bgSelected: "bg-zinc-500",
        text: "text-zinc-200",
        border: "border-zinc-400/50",
        glow: "shadow-zinc-400/40",
    },
};

interface TypeFilterChipsProps {
    selectedType: string | null;
    onTypeChange: (type: string | null) => void;
    className?: string;
}

export function TypeFilterChips({
    selectedType,
    onTypeChange,
    className,
}: TypeFilterChipsProps) {
    const handleTypeClick = (type: PokemonType) => {
        if (type === "All") {
            onTypeChange(null);
        } else {
            onTypeChange(selectedType === type ? null : type);
        }
    };

    return (
        <div className={cn("w-full", className)}>
            {/* Scroll container with fade masks on mobile */}
            <div className="relative md:static">
                {/* Left fade mask - mobile only */}
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-950/90 to-transparent z-10 pointer-events-none md:hidden" />
                {/* Right fade mask - mobile only */}
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-950/90 to-transparent z-10 pointer-events-none md:hidden" />

                <div className="
                    flex 
                    overflow-x-auto 
                    pb-2 
                    px-4
                    snap-x snap-mandatory 
                    scrollbar-hide 
                    md:flex-wrap md:justify-center md:overflow-visible md:pb-0 md:px-0
                    gap-2
                ">
                    {POKEMON_TYPES.map((type, index) => {
                        const isSelected = type === "All" ? !selectedType : selectedType === type;
                        const colors = typeColors[type] || typeColors.Normal;

                        return (
                            <motion.button
                                key={type}
                                onClick={() => handleTypeClick(type)}
                                className={cn(
                                    "flex-shrink-0 snap-start",
                                    "px-3.5 py-1.5 rounded-xl text-sm font-bold border-2 transition-all duration-200",
                                    isSelected
                                        ? `${colors.bgSelected} text-white border-transparent shadow-lg ${colors.glow}`
                                        : `${colors.bg} ${colors.text} ${colors.border} hover:border-white/30`,
                                )}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: isSelected ? -2 : 0,
                                }}
                                transition={{
                                    duration: 0.2,
                                    delay: index < 10 ? index * 0.03 : 0
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {type}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
            {/* Scroll indicator for mobile */}
            <div className="md:hidden flex justify-center mt-1 gap-1">
                <div className="w-8 h-1 rounded-full bg-slate-700/50" />
            </div>
        </div>
    );
}
