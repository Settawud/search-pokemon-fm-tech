"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { getTypeStyle, getPokemonImage } from "../lib/utils";

interface PokemonCardProps {
    name: string;
    image: string;
    types: string[];
    index: number;
    number: string;
    onNavigate?: (name: string) => void;
}

// Animation variants - simplified for better performance
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: Math.min(index * 0.02, 0.3), // Cap delay at 0.3s
            duration: 0.3,
        }
    }),
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

// Base64 blur placeholder for images
const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

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
            variants={cardVariants}
            className="transform-gpu" // GPU acceleration
        >
            <Link href={`/pokemon/${name.toLowerCase()}`} onClick={handleClick}>
                <div className="relative group cursor-pointer bg-slate-900/60 backdrop-blur-sm border-2 border-white/10 hover:border-blue-500/50 rounded-2xl p-4 text-center overflow-hidden shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]">
                    {/* Background Gradient on Hover */}
                    <div
                        className={`absolute inset-0 ${primaryColor.solid} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                    />

                    {/* Pokemon Number Badge */}
                    <div className="absolute top-2 left-2 text-xs font-mono text-slate-400 bg-slate-800/90 px-2 py-1 rounded-lg border border-white/10 group-hover:border-blue-500/30 transition-colors">
                        #{number}
                    </div>

                    {/* Pokemon Image - Using Next.js Image for optimization */}
                    <div className="relative mb-3 mt-4">
                        {imageError ? (
                            <PokeballPlaceholder />
                        ) : (
                            <div className="w-28 h-28 mx-auto relative group-hover:scale-110 transition-transform duration-200">
                                <Image
                                    src={imageUrl}
                                    alt={name}
                                    fill
                                    sizes="112px"
                                    className="object-contain drop-shadow-xl"
                                    onError={handleImageError}
                                    placeholder="blur"
                                    blurDataURL={BLUR_DATA_URL}
                                    loading={index < 12 ? "eager" : "lazy"} // First 12 load eagerly
                                />
                            </div>
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
