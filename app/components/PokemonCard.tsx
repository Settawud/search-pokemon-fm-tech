"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getTypeStyle, getPokemonImage } from "../lib/utils";

interface PokemonCardProps {
    name: string;
    image: string;
    types: string[];
    index: number;
    number: string;
    onNavigate?: (name: string) => void;
}

// Animation variants
const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: index * 0.02,
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1] as const
        }
    }),
    hover: {
        y: -10,
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1] as const
        }
    }
};

// Pokeball placeholder component for missing images
function PokeballPlaceholder() {
    return (
        <div className="w-28 h-28 mx-auto flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-red-500 to-red-600 relative overflow-hidden shadow-lg opacity-50">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-800 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-slate-800" />
            </div>
        </div>
    );
}

export function PokemonCard({ name, image, types, index, number, onNavigate }: PokemonCardProps) {
    const [imageError, setImageError] = useState(false);
    const primaryType = types[0];
    const primaryColor = getTypeStyle(primaryType);
    const imageUrl = number ? getPokemonImage(number) : image;

    const handleClick = () => {
        if (onNavigate) {
            onNavigate(name);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
        >
            <Link href={`/pokemon/${name.toLowerCase()}`} onClick={handleClick}>
                <div className="relative group cursor-pointer bg-slate-900/60 backdrop-blur-sm border-2 border-white/10 hover:border-blue-500/50 rounded-2xl p-4 text-center overflow-hidden shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                    {/* Background Gradient on Hover */}
                    <div
                        className={`absolute inset-0 ${primaryColor.solid} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                    />

                    {/* Subtle Glow Ring on Hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="absolute inset-0 border-2 border-blue-400/30 rounded-2xl" />
                    </div>

                    {/* Pokemon Number Badge */}
                    <div className="absolute top-2 left-2 text-xs font-mono text-slate-400 bg-slate-800/90 px-2 py-1 rounded-lg border border-white/10 group-hover:border-blue-500/30 transition-colors">
                        #{number}
                    </div>

                    {/* Pokemon Image */}
                    <div className="relative mb-3 mt-4">
                        {imageError ? (
                            <PokeballPlaceholder />
                        ) : (
                            <motion.img
                                src={imageUrl}
                                alt={name}
                                className="w-28 h-28 mx-auto drop-shadow-xl object-contain"
                                onError={handleImageError}
                                whileHover={{
                                    scale: 1.15,
                                    rotate: 5,
                                    transition: { duration: 0.2 }
                                }}
                            />
                        )}

                        {/* Glow Shadow underneath on hover */}
                        <div
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 ${primaryColor.solid} opacity-0 group-hover:opacity-30 blur-xl rounded-full transition-opacity duration-300`}
                        />
                    </div>

                    {/* Pokemon Name */}
                    <h2 className="text-white font-bold capitalize mb-2 text-base group-hover:text-blue-400 transition-colors">
                        {name}
                    </h2>

                    {/* Type Badges */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {types.map((type) => {
                            const style = getTypeStyle(type);
                            return (
                                <span
                                    key={type}
                                    className={`${style.bg} ${style.text} text-xs px-3 py-1 rounded-full font-semibold border-2 ${style.border} shadow-sm group-hover:scale-105 transition-transform`}
                                >
                                    {type}
                                </span>
                            );
                        })}
                    </div>

                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>
            </Link>
        </motion.div>
    );
}

