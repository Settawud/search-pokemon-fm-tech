"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_POKEMON } from "../../lib/queries";
import Link from "next/link";

// Type สำหรับ Attack
interface Attack {
    name: string;
    damage: number;
    type: string;
}

// Type สำหรับ Weight/height
interface PokemonDimension {
    maximum: string;
    minimum: string;
}

// Type สำหรับ Evolution
interface Evolution {
    id: string;
    name: string;
    image: string;
}

interface EvolutionRequirement {
    amount: number;
    name: string;
}

// Type สำหรับ Pokemon
interface Pokemon {
    id: string;
    name: string;
    image: string;
    types: string[];
    attacks: {
        fast: Attack[];
        special: Attack[];
    };
    maxCP: number;
    maxHP: number;
    weight: PokemonDimension;
    height: PokemonDimension;
    weaknesses: string[];
    evolutions: Evolution[] | null;
    resistant: string[];
    number: string;
    classification: string;
    fleeRate: number;
    evolutionRequirements: EvolutionRequirement | null;
}

// Type สำหรับ Query Response
interface GetPokemonData {
    pokemon: Pokemon;
}

// Type color mapping
const typeColors: Record<string, { bg: string; text: string; solid: string }> = {
    Grass: { bg: "bg-emerald-500/15", text: "text-emerald-400", solid: "bg-emerald-500" },
    Poison: { bg: "bg-purple-500/15", text: "text-purple-400", solid: "bg-purple-500" },
    Fire: { bg: "bg-red-500/15", text: "text-red-400", solid: "bg-red-500" },
    Water: { bg: "bg-blue-500/15", text: "text-blue-400", solid: "bg-blue-500" },
    Electric: { bg: "bg-yellow-500/15", text: "text-yellow-400", solid: "bg-yellow-500" },
    Psychic: { bg: "bg-pink-500/15", text: "text-pink-400", solid: "bg-pink-500" },
    Ice: { bg: "bg-cyan-500/15", text: "text-cyan-400", solid: "bg-cyan-500" },
    Dragon: { bg: "bg-violet-500/15", text: "text-violet-400", solid: "bg-violet-500" },
    Dark: { bg: "bg-slate-500/15", text: "text-slate-400", solid: "bg-slate-500" },
    Fairy: { bg: "bg-pink-400/15", text: "text-pink-300", solid: "bg-pink-400" },
    Fighting: { bg: "bg-orange-500/15", text: "text-orange-400", solid: "bg-orange-500" },
    Flying: { bg: "bg-indigo-400/15", text: "text-indigo-300", solid: "bg-indigo-400" },
    Ground: { bg: "bg-amber-600/15", text: "text-amber-500", solid: "bg-amber-600" },
    Rock: { bg: "bg-stone-500/15", text: "text-stone-400", solid: "bg-stone-500" },
    Bug: { bg: "bg-lime-500/15", text: "text-lime-400", solid: "bg-lime-500" },
    Ghost: { bg: "bg-violet-600/15", text: "text-violet-400", solid: "bg-violet-600" },
    Steel: { bg: "bg-slate-400/15", text: "text-slate-300", solid: "bg-slate-400" },
    Normal: { bg: "bg-gray-500/15", text: "text-gray-400", solid: "bg-gray-500" },
};

const getTypeStyle = (type: string) => {
    return typeColors[type] || { bg: "bg-slate-500/15", text: "text-slate-400", solid: "bg-slate-500" };
};

// Stat Card Component
function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
    return (
        <div className="glass-card p-4 text-center">
            <span className="text-2xl mb-2 block">{icon}</span>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className="text-white font-semibold">{value}</p>
        </div>
    );
}

// Progress Bar Component
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
    const percentage = Math.min((value / max) * 100, 100);
    return (
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div
                className={`h-full rounded-full progress-bar ${color}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

export default function PokemonDetail() {
    // ดึง parameter จาก URL
    const params = useParams();
    const name = params.name as string;

    // Query Pokemon ตามชื่อ
    const { loading, error, data } = useQuery<GetPokemonData>(GET_POKEMON, {
        variables: { name }, // ส่ง variable ไปกับ query
    });

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400 mt-4">Loading Pokémon data...</p>
                </div>
            </div>
        );
    }

    // Error/Not Found State
    if (error || !data?.pokemon) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-5xl">❓</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Pokémon Not Found</h1>
                    <p className="text-slate-400 mb-6">
                        We couldn't find a Pokémon named "<span className="text-blue-400 capitalize">{name}</span>".
                        Please check the spelling and try again.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const pokemon = data.pokemon;
    const primaryType = pokemon.types[0];
    const primaryColor = getTypeStyle(primaryType);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 animate-fade-in">
            {/* Header */}
            <header className="px-6 py-4">
                <div className="max-w-6xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Pokédex
                    </Link>
                </div>
            </header>

            {/* Main Content - 2 Column Layout */}
            <main className="px-6 pb-12">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left Column - Identity */}
                        <div className="space-y-6">
                            {/* Featured Card */}
                            <div className="glass-card p-8 text-center relative overflow-hidden">
                                {/* Background Glow */}
                                <div className={`absolute inset-0 ${primaryColor.solid} opacity-5 blur-3xl`}></div>

                                {/* Pokemon Number */}
                                <span className="text-slate-500 text-sm font-mono">#{pokemon.number}</span>

                                {/* Pokemon Image */}
                                <div className="relative my-6">
                                    <div className={`absolute inset-0 ${primaryColor.solid} opacity-20 blur-3xl rounded-full`}></div>
                                    <img
                                        src={pokemon.image}
                                        alt={pokemon.name}
                                        className="w-56 h-56 mx-auto relative drop-shadow-2xl"
                                    />
                                </div>

                                {/* Pokemon Name */}
                                <h1 className="text-4xl font-bold text-white capitalize mb-2">{pokemon.name}</h1>
                                <p className="text-slate-400 italic mb-4">{pokemon.classification}</p>

                                {/* Type Badges */}
                                <div className="flex justify-center gap-2">
                                    {pokemon.types.map((type) => {
                                        const style = getTypeStyle(type);
                                        return (
                                            <span
                                                key={type}
                                                className={`${style.bg} ${style.text} px-4 py-1.5 rounded-full font-medium text-sm`}
                                            >
                                                {type}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <StatCard label="Max CP" value={pokemon.maxCP} icon="⚡" />
                                <StatCard label="Max HP" value={pokemon.maxHP} icon="❤️" />
                                <StatCard label="Weight" value={pokemon.weight.maximum} icon="⚖️" />
                                <StatCard label="Height" value={pokemon.height.maximum} icon="📏" />
                            </div>

                            {/* Flee Rate */}
                            <div className="glass-card p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400 text-sm">Flee Rate</span>
                                    <span className="text-white font-medium">{(pokemon.fleeRate * 100).toFixed(0)}%</span>
                                </div>
                                <ProgressBar value={pokemon.fleeRate * 100} max={100} color="bg-red-500" />
                            </div>

                            {/* Evolutions */}
                            {pokemon.evolutions && pokemon.evolutions.length > 0 && (
                                <div className="glass-card p-6">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <span>🔄</span> Evolution Chain
                                    </h2>
                                    {pokemon.evolutionRequirements && (
                                        <p className="text-slate-400 text-sm mb-4">
                                            Requires: {pokemon.evolutionRequirements.amount} {pokemon.evolutionRequirements.name}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-center gap-4 flex-wrap">
                                        {pokemon.evolutions.map((evo, index) => (
                                            <div key={evo.id} className="flex items-center gap-4">
                                                {index > 0 && (
                                                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                )}
                                                <Link
                                                    href={`/pokemon/${evo.name.toLowerCase()}`}
                                                    className="text-center group"
                                                >
                                                    <div className="w-20 h-20 bg-slate-800/50 rounded-xl p-2 group-hover:bg-slate-700/50 transition-colors">
                                                        <img src={evo.image} alt={evo.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <p className="text-slate-300 text-sm mt-2 capitalize group-hover:text-blue-400 transition-colors">
                                                        {evo.name}
                                                    </p>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Combat & Stats */}
                        <div className="space-y-6">
                            {/* Resistances & Weaknesses */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Resistant */}
                                <div className="glass-card p-5">
                                    <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                        <span className="text-lg">🛡️</span> Resistant To
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {pokemon.resistant.map((type) => {
                                            const style = getTypeStyle(type);
                                            return (
                                                <span
                                                    key={type}
                                                    className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-xs font-medium`}
                                                >
                                                    {type}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Weaknesses */}
                                <div className="glass-card p-5">
                                    <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                        <span className="text-lg">⚠️</span> Weak Against
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {pokemon.weaknesses.map((type) => {
                                            const style = getTypeStyle(type);
                                            return (
                                                <span
                                                    key={type}
                                                    className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-xs font-medium`}
                                                >
                                                    {type}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Fast Attacks */}
                            <div className="glass-card p-5">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span>⚡</span> Fast Attacks
                                </h3>
                                <div className="space-y-2">
                                    {pokemon.attacks?.fast?.map((attack) => {
                                        const style = getTypeStyle(attack.type);
                                        return (
                                            <div
                                                key={attack.name}
                                                className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-xs font-medium`}>
                                                        {attack.type}
                                                    </span>
                                                    <span className="text-white font-medium">{attack.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 text-sm">{attack.damage}</span>
                                                    <span className="text-yellow-400 text-xs font-medium">DMG</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Special Attacks */}
                            <div className="glass-card p-5">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span>💥</span> Special Attacks
                                </h3>
                                <div className="space-y-2">
                                    {pokemon.attacks?.special?.map((attack) => {
                                        const style = getTypeStyle(attack.type);
                                        return (
                                            <div
                                                key={attack.name}
                                                className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-xs font-medium`}>
                                                        {attack.type}
                                                    </span>
                                                    <span className="text-white font-medium">{attack.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ProgressBar value={attack.damage} max={150} color="bg-purple-500" />
                                                    <span className="text-slate-300 text-sm font-medium min-w-[3rem] text-right">
                                                        {attack.damage}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="glass-card p-5">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <span>📊</span> Combat Stats
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-400">Max CP</span>
                                            <span className="text-white font-medium">{pokemon.maxCP}</span>
                                        </div>
                                        <ProgressBar value={pokemon.maxCP} max={4000} color="bg-yellow-500" />
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-400">Max HP</span>
                                            <span className="text-white font-medium">{pokemon.maxHP}</span>
                                        </div>
                                        <ProgressBar value={pokemon.maxHP} max={500} color="bg-green-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
