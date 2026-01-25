"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GET_POKEMON } from "../../lib/queries";
import { getTypeStyle, cn } from "../../lib/utils";
import { PokemonDetailSkeleton } from "../../components/Skeleton";
import {
    ChevronLeft,
    Sword,
    Zap,
    Heart,
    Shield,
    AlertTriangle,
    Scale,
    Ruler,
    Target,
    TrendingUp,
    Sparkles,
    ArrowRight
} from "lucide-react";

// Type definitions
interface Attack {
    name: string;
    damage: number;
    type: string;
}

interface PokemonDimension {
    maximum: string;
    minimum: string;
}

interface Evolution {
    id: string;
    name: string;
    image: string;
}

interface EvolutionRequirement {
    amount: number;
    name: string;
}

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

interface GetPokemonData {
    pokemon: Pokemon;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Stat Card Component
function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-colors"
        >
            <Icon className="w-6 h-6 mx-auto mb-2 text-slate-400" />
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
            <p className="text-white font-semibold">{value}</p>
        </motion.div>
    );
}

// Progress Bar Component
function ProgressBar({ value, max, color, showLabel = true }: { value: number; max: number; color: string; showLabel?: boolean }) {
    const percentage = Math.min((value / max) * 100, 100);
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-800/50 rounded-full h-2 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full", color)}
                />
            </div>
            {showLabel && (
                <span className="text-slate-300 text-sm font-medium min-w-[3rem] text-right">
                    {value}
                </span>
            )}
        </div>
    );
}

export default function PokemonDetail() {
    const params = useParams();
    const name = params.name as string;

    const { loading, error, data } = useQuery<GetPokemonData>(GET_POKEMON, {
        variables: { name },
    });

    // Loading State - Skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-8">
                <div className="max-w-6xl mx-auto mb-8">
                    <div className="h-10 w-40 bg-slate-800/50 rounded-lg animate-pulse" />
                </div>
                <PokemonDetailSkeleton />
            </div>
        );
    }

    // Error/Not Found State
    if (error || !data?.pokemon) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-12 h-12 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3">Pokémon Not Found</h1>
                    <p className="text-slate-400 mb-6">
                        We couldn&apos;t find a Pokémon named &quot;<span className="text-blue-400 capitalize">{name}</span>&quot;.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        );
    }

    const pokemon = data.pokemon;
    const primaryType = pokemon.types[0];
    const primaryColor = getTypeStyle(primaryType);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Mesh Gradient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${primaryColor.solid} opacity-5 rounded-full blur-3xl`} />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="px-6 py-6 border-b border-white/5">
                    <div className="max-w-6xl mx-auto">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Pokédex
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-6 py-8">
                    <motion.div
                        className="max-w-6xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* Left Column - Identity (5 cols) */}
                            <div className="lg:col-span-5 space-y-6">
                                {/* Featured Card */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden"
                                >
                                    {/* Background Glow */}
                                    <div className={`absolute inset-0 ${primaryColor.solid} opacity-5 blur-3xl`} />

                                    {/* Pokemon Number */}
                                    <span className="text-slate-500 text-sm font-mono">#{pokemon.number}</span>

                                    {/* Pokemon Image */}
                                    <motion.div
                                        className="relative my-6"
                                        whileHover={{ scale: 1.05, rotate: 3 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`absolute inset-0 ${primaryColor.solid} opacity-20 blur-3xl rounded-full`} />
                                        <img
                                            src={pokemon.image}
                                            alt={pokemon.name}
                                            className="w-56 h-56 mx-auto relative drop-shadow-2xl"
                                        />
                                    </motion.div>

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
                                                    className={`${style.bg} ${style.text} px-4 py-1.5 rounded-full font-medium text-sm border ${style.border}`}
                                                >
                                                    {type}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <StatCard label="Max CP" value={pokemon.maxCP} icon={TrendingUp} />
                                    <StatCard label="Max HP" value={pokemon.maxHP} icon={Heart} />
                                    <StatCard label="Weight" value={pokemon.weight.maximum} icon={Scale} />
                                    <StatCard label="Height" value={pokemon.height.maximum} icon={Ruler} />
                                </div>

                                {/* Flee Rate */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-red-400" />
                                            <span className="text-slate-400 text-sm">Flee Rate</span>
                                        </div>
                                        <span className="text-white font-medium">{(pokemon.fleeRate * 100).toFixed(0)}%</span>
                                    </div>
                                    <ProgressBar value={pokemon.fleeRate * 100} max={100} color="bg-red-500" showLabel={false} />
                                </motion.div>
                            </div>

                            {/* Right Column - Combat & Stats (7 cols) */}
                            <div className="lg:col-span-7 space-y-6">
                                {/* Resistances & Weaknesses */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Resistant */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                    >
                                        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-green-400" />
                                            Resistant To
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {pokemon.resistant.map((type) => {
                                                const style = getTypeStyle(type);
                                                return (
                                                    <span
                                                        key={type}
                                                        className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-xs font-medium border ${style.border}`}
                                                    >
                                                        {type}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </motion.div>

                                    {/* Weaknesses */}
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                    >
                                        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 text-red-400" />
                                            Weak Against
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {pokemon.weaknesses.map((type) => {
                                                const style = getTypeStyle(type);
                                                return (
                                                    <span
                                                        key={type}
                                                        className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-xs font-medium border ${style.border}`}
                                                    >
                                                        {type}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Fast Attacks */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Sword className="w-5 h-5 text-yellow-400" />
                                        Fast Attacks
                                    </h3>
                                    <div className="space-y-2">
                                        {pokemon.attacks?.fast?.map((attack) => {
                                            const style = getTypeStyle(attack.type);
                                            return (
                                                <div
                                                    key={attack.name}
                                                    className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-3 hover:bg-slate-800 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-xs font-medium border ${style.border}`}>
                                                            {attack.type}
                                                        </span>
                                                        <span className="text-white font-medium">{attack.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-yellow-400 font-bold">{attack.damage}</span>
                                                        <span className="text-slate-500 text-xs">DMG</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Special Attacks */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-purple-400" />
                                        Special Attacks
                                    </h3>
                                    <div className="space-y-3">
                                        {pokemon.attacks?.special?.map((attack) => {
                                            const style = getTypeStyle(attack.type);
                                            return (
                                                <div
                                                    key={attack.name}
                                                    className="bg-slate-800/50 rounded-lg px-4 py-3 hover:bg-slate-800 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-xs font-medium border ${style.border}`}>
                                                                {attack.type}
                                                            </span>
                                                            <span className="text-white font-medium">{attack.name}</span>
                                                        </div>
                                                        <span className="text-purple-400 font-bold">{attack.damage}</span>
                                                    </div>
                                                    <ProgressBar value={attack.damage} max={150} color="bg-purple-500" showLabel={false} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Evolution Chain */}
                                <AnimatePresence>
                                    {pokemon.evolutions && pokemon.evolutions.length > 0 && (
                                        <motion.div
                                            variants={itemVariants}
                                            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                        >
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-blue-400" />
                                                Evolution Chain
                                            </h3>
                                            {pokemon.evolutionRequirements && (
                                                <p className="text-slate-400 text-sm mb-4">
                                                    Requires: <span className="text-blue-400">{pokemon.evolutionRequirements.amount} {pokemon.evolutionRequirements.name}</span>
                                                </p>
                                            )}
                                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                                {pokemon.evolutions.map((evo, index) => (
                                                    <div key={evo.id} className="flex items-center gap-4">
                                                        {index > 0 && (
                                                            <ArrowRight className="w-6 h-6 text-slate-500" />
                                                        )}
                                                        <Link
                                                            href={`/pokemon/${evo.name.toLowerCase()}`}
                                                            className="text-center group"
                                                        >
                                                            <motion.div
                                                                className="w-20 h-20 bg-slate-800/50 border border-white/10 rounded-xl p-2 group-hover:border-blue-500/50 group-hover:bg-slate-800 transition-all"
                                                                whileHover={{ scale: 1.1 }}
                                                            >
                                                                <img src={evo.image} alt={evo.name} className="w-full h-full object-contain" />
                                                            </motion.div>
                                                            <p className="text-slate-300 text-sm mt-2 capitalize group-hover:text-blue-400 transition-colors">
                                                                {evo.name}
                                                            </p>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Combat Stats Overview */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                        Combat Stats
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-400 flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4" /> Max CP
                                                </span>
                                                <span className="text-white font-medium">{pokemon.maxCP}</span>
                                            </div>
                                            <ProgressBar value={pokemon.maxCP} max={4000} color="bg-yellow-500" showLabel={false} />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-400 flex items-center gap-2">
                                                    <Heart className="w-4 h-4" /> Max HP
                                                </span>
                                                <span className="text-white font-medium">{pokemon.maxHP}</span>
                                            </div>
                                            <ProgressBar value={pokemon.maxHP} max={500} color="bg-green-500" showLabel={false} />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
