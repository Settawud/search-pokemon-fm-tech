import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Pokemon Type color mapping
export const typeColors: Record<string, { bg: string; text: string; solid: string; border: string }> = {
    Grass: { bg: "bg-emerald-500/15", text: "text-emerald-400", solid: "bg-emerald-500", border: "border-emerald-500/30" },
    Poison: { bg: "bg-purple-500/15", text: "text-purple-400", solid: "bg-purple-500", border: "border-purple-500/30" },
    Fire: { bg: "bg-red-500/15", text: "text-red-400", solid: "bg-red-500", border: "border-red-500/30" },
    Water: { bg: "bg-blue-500/15", text: "text-blue-400", solid: "bg-blue-500", border: "border-blue-500/30" },
    Electric: { bg: "bg-yellow-500/15", text: "text-yellow-400", solid: "bg-yellow-500", border: "border-yellow-500/30" },
    Psychic: { bg: "bg-pink-500/15", text: "text-pink-400", solid: "bg-pink-500", border: "border-pink-500/30" },
    Ice: { bg: "bg-cyan-500/15", text: "text-cyan-400", solid: "bg-cyan-500", border: "border-cyan-500/30" },
    Dragon: { bg: "bg-violet-500/15", text: "text-violet-400", solid: "bg-violet-500", border: "border-violet-500/30" },
    Dark: { bg: "bg-slate-500/15", text: "text-slate-400", solid: "bg-slate-500", border: "border-slate-500/30" },
    Fairy: { bg: "bg-pink-400/15", text: "text-pink-300", solid: "bg-pink-400", border: "border-pink-400/30" },
    Fighting: { bg: "bg-orange-500/15", text: "text-orange-400", solid: "bg-orange-500", border: "border-orange-500/30" },
    Flying: { bg: "bg-indigo-400/15", text: "text-indigo-300", solid: "bg-indigo-400", border: "border-indigo-400/30" },
    Ground: { bg: "bg-amber-600/15", text: "text-amber-500", solid: "bg-amber-600", border: "border-amber-600/30" },
    Rock: { bg: "bg-stone-500/15", text: "text-stone-400", solid: "bg-stone-500", border: "border-stone-500/30" },
    Bug: { bg: "bg-lime-500/15", text: "text-lime-400", solid: "bg-lime-500", border: "border-lime-500/30" },
    Ghost: { bg: "bg-violet-600/15", text: "text-violet-400", solid: "bg-violet-600", border: "border-violet-600/30" },
    Steel: { bg: "bg-slate-400/15", text: "text-slate-300", solid: "bg-slate-400", border: "border-slate-400/30" },
    Normal: { bg: "bg-gray-500/15", text: "text-gray-400", solid: "bg-gray-500", border: "border-gray-500/30" },
};

export function getTypeStyle(type: string) {
    return typeColors[type] || { bg: "bg-slate-500/15", text: "text-slate-400", solid: "bg-slate-500", border: "border-slate-500/30" };
}

export function getPokemonImage(number: string): string {
    // Convert "001" to 1 by parsing int
    const id = parseInt(number, 10);
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
