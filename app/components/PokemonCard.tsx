"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getTypeStyle, getPokemonImage } from "../lib/utils";

interface PokemonCardProps {
    name: string;
    image: string;
    types: string[];
    index: number;
    number: string;
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
            delay: index * 0.03,
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1] as const
        }
    }),
    hover: {
        y: -8,
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1] as const
        }
    }
};

export function PokemonCard({ name, image, types, index, number }: PokemonCardProps) {
    const primaryType = types[0];
    const primaryColor = getTypeStyle(primaryType);
    const imageUrl = number ? getPokemonImage(number) : image;

    return (
        <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
        >
            <Link href={`/pokemon/${name.toLowerCase()}`}>
                <div className="relative group cursor-pointer bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center overflow-hidden">
                    {/* Gradient Glow on Hover */}
                    <div
                        className={`absolute inset-0 ${primaryColor.solid} opacity-0 group-hover:opacity-5 transition-opacity duration-300 blur-xl`}
                    />

                    {/* Pokemon Image */}
                    <div className="relative mb-3">
                        <motion.img
                            src={imageUrl}
                            alt={name}
                            className="w-24 h-24 mx-auto drop-shadow-lg object-contain"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>

                    {/* Pokemon Name */}
                    <h2 className="text-white font-semibold capitalize mb-2 group-hover:text-blue-400 transition-colors">
                        {name}
                    </h2>

                    {/* Type Badges */}
                    <div className="flex flex-wrap justify-center gap-1">
                        {types.map((type) => {
                            const style = getTypeStyle(type);
                            return (
                                <span
                                    key={type}
                                    className={`${style.bg} ${style.text} text-xs px-2 py-0.5 rounded-full font-medium border ${style.border}`}
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
