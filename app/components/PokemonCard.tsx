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
    isNewCard?: boolean;
}

// Pokeball placeholder component for missing images
function PokeballPlaceholder() {
    return (
        <div className="w-28 h-28 mx-auto flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-red-500 to-red-600 relative overflow-hidden opacity-50">
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-800 -translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-4 border-slate-800" />
            </div>
        </div>
    );
}

// Skeleton placeholder shown while image is loading
function CardSkeleton() {
    return (
        <div className="bg-slate-900/80 border-2 border-white/5 rounded-2xl p-4 text-center overflow-hidden animate-pulse">
            {/* Number badge skeleton */}
            <div className="flex justify-start mb-4">
                <div className="w-12 h-5 bg-slate-800 rounded-lg" />
            </div>
            {/* Image skeleton */}
            <div className="w-28 h-28 mx-auto mb-3 rounded-xl bg-slate-800/60" />
            {/* Name skeleton */}
            <div className="w-20 h-5 mx-auto mb-2 rounded bg-slate-800/60" />
            {/* Type badges skeleton */}
            <div className="flex justify-center gap-1.5">
                <div className="w-14 h-6 rounded-full bg-slate-800/60" />
                <div className="w-14 h-6 rounded-full bg-slate-800/60" />
            </div>
        </div>
    );
}

export function PokemonCard({ name, image, types, index, number, onNavigate, isNewCard = true }: PokemonCardProps) {
    const primaryType = types[0];
    const primaryColor = getTypeStyle(primaryType);
    const imageUrl = number ? getPokemonImage(number) : image;

    // Check if image is already in browser cache to skip skeleton on back-navigation
    const isImageCached = () => {
        if (typeof window === 'undefined') return false;
        const img = new window.Image();
        img.src = imageUrl;
        return img.complete && img.naturalWidth > 0;
    };

    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(() => isImageCached());

    const handleClick = () => {
        if (onNavigate) {
            onNavigate(name);
        }
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true); // Show card with placeholder
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    // Show skeleton while image is loading (only for new cards that haven't loaded yet)
    if (!imageLoaded && !imageError) {
        return (
            <div className="transform-gpu backface-hidden">
                {/* Hidden image to trigger loading */}
                <div className="sr-only">
                    <Image
                        src={imageUrl}
                        alt={name}
                        width={112}
                        height={112}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading={index < 8 ? "eager" : "lazy"}
                    />
                </div>
                <CardSkeleton />
            </div>
        );
    }

    return (
        <motion.div
            initial={isNewCard ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{
                duration: 0.25,
                // Stagger only first batch for initial page load feel
                delay: isNewCard && index < 6 ? index * 0.03 : 0,
            }}
            className="transform-gpu backface-hidden"
        >
            <Link href={`/pokemon/${name.toLowerCase()}`} onClick={handleClick}>
                <div className="relative group cursor-pointer bg-slate-900/80 border-2 border-white/5 hover:border-blue-500/50 rounded-2xl p-4 text-center overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:bg-slate-800/80">
                    {/* Background Gradient on Hover */}
                    <div
                        className={`absolute inset-0 ${primaryColor.solid} opacity-0 group-hover:opacity-10 transition-opacity duration-200 rounded-2xl`}
                    />

                    {/* Pokemon Number Badge */}
                    <div className="absolute top-2 left-2 text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded-lg border border-white/5 group-hover:border-blue-500/30 transition-colors">
                        #{number}
                    </div>

                    {/* Pokemon Image */}
                    <div className="relative mb-3 mt-4">
                        {imageError ? (
                            <PokeballPlaceholder />
                        ) : (
                            <div className="w-28 h-28 mx-auto relative group-hover:scale-105 transition-transform duration-200">
                                <Image
                                    src={imageUrl}
                                    alt={name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className="object-contain"
                                    onError={handleImageError}
                                    loading={index < 8 ? "eager" : "lazy"}
                                />
                            </div>
                        )}

                        {/* Glow Shadow underneath on hover */}
                        <div
                            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 ${primaryColor.solid} opacity-0 group-hover:opacity-20 blur-lg rounded-full transition-opacity duration-200`}
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
                                    className={`${style.bg} ${style.text} text-xs px-3 py-1 rounded-full font-semibold border ${style.border} group-hover:scale-105 transition-transform`}
                                >
                                    {type}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
