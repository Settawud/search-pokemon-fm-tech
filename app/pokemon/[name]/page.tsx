"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { GET_POKEMON } from "../../lib/queries";
import { getTypeStyle, cn, capitalize, getPokemonImageFromSprites } from "../../lib/utils";
import { useSearchStats } from "../../hooks/useSearchStats";
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
    ArrowRight,
    Ban
} from "lucide-react";

// Type definitions for PokeAPI
interface PokeAPIPokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    pokemon_v2_pokemontypes: {
        pokemon_v2_type: {
            name: string;
        };
    }[];
    pokemon_v2_pokemonstats: {
        base_stat: number;
        pokemon_v2_stat: {
            name: string;
        };
    }[];
    pokemon_v2_pokemonabilities: {
        pokemon_v2_ability: {
            name: string;
        };
    }[];
    pokemon_v2_pokemonsprites: {
        sprites: string;
    }[];
    pokemon_v2_pokemonspecy: {
        pokemon_v2_evolutionchain: {
            pokemon_v2_pokemonspecies: {
                id: number;
                name: string;
                order: number;
                pokemon_v2_pokemons: {
                    id: number;
                    pokemon_v2_pokemonsprites: {
                        sprites: string;
                    }[];
                }[];
            }[];
        };
        pokemon_v2_pokemonspeciesflavortexts: {
            flavor_text: string;
        }[];
    };
}

interface GetPokemonData {
    pokemon_v2_pokemon: PokeAPIPokemon[];
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
function StatCard({ label, value, icon: Icon, colorClass = "text-slate-400" }: { label: string; value: string | number; icon: React.ElementType; colorClass?: string }) {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-colors"
        >
            <Icon className={`w-6 h-6 mx-auto mb-2 ${colorClass}`} />
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

// Stat name to color map
const statColors: Record<string, string> = {
    hp: "bg-green-500",
    attack: "bg-red-500",
    defense: "bg-blue-500",
    "special-attack": "bg-purple-500",
    "special-defense": "bg-indigo-500",
    speed: "bg-yellow-500",
};

export default function PokemonDetail() {
    const params = useParams();
    const router = useRouter();
    const name = (params.name as string).toLowerCase();

    // Search Statistics Hook - record when user visits this page
    const { recordSearch } = useSearchStats();

    const { loading, error, data } = useQuery<GetPokemonData>(GET_POKEMON, {
        variables: { name },
        fetchPolicy: "network-only", // Bypass cache for detail page to avoid keyFields extraction issues
    });

    // Record the search when pokemon data is successfully loaded
    useEffect(() => {
        if (data?.pokemon_v2_pokemon?.[0]) {
            recordSearch(name);
        }
    }, [data, name, recordSearch]);

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
    if (error || !data?.pokemon_v2_pokemon?.[0]) {
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

    const pokemon = data.pokemon_v2_pokemon[0];
    const types = pokemon.pokemon_v2_pokemontypes.map(t => capitalize(t.pokemon_v2_type.name));
    const primaryType = types[0];
    const primaryColor = getTypeStyle(primaryType);
    const sprites = pokemon.pokemon_v2_pokemonsprites[0]?.sprites || null;
    const imageUrl = getPokemonImageFromSprites(sprites, pokemon.id);

    // Get stats
    const stats = pokemon.pokemon_v2_pokemonstats || [];
    const hpStat = stats.find(s => s.pokemon_v2_stat.name === "hp")?.base_stat || 0;
    const attackStat = stats.find(s => s.pokemon_v2_stat.name === "attack")?.base_stat || 0;

    // Get abilities
    const abilities = pokemon.pokemon_v2_pokemonabilities?.map(a => capitalize(a.pokemon_v2_ability.name)) || [];

    // Get evolution chain
    const evolutionChain = pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_evolutionchain?.pokemon_v2_pokemonspecies || [];

    // Check if this is a special form that cannot evolve
    const specialFormSuffixes = ['-starter', '-gmax', '-mega', '-totem', '-alola', '-galar', '-hisui', '-paldea'];
    const isSpecialForm = specialFormSuffixes.some(suffix => pokemon.name.toLowerCase().endsWith(suffix));
    const cannotEvolve = isSpecialForm && (pokemon.name.includes('-starter') || pokemon.name.includes('-gmax') || pokemon.name.includes('-mega'));

    // Get flavor text (description)
    const flavorText = pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts?.[0]?.flavor_text?.replace(/\n|\f/g, " ") || "";

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
                <header className="px-6 py-6 border-b border-white/10">
                    <div className="max-w-6xl mx-auto">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-blue-600 text-white font-medium rounded-xl border border-white/20 hover:border-blue-500 shadow-lg hover:shadow-blue-500/25 transition-all group cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Pokédex
                        </button>
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
                                    <span className="text-slate-500 text-sm font-mono">#{pokemon.id.toString().padStart(3, "0")}</span>

                                    {/* Pokemon Image */}
                                    <motion.div
                                        className="relative my-6"
                                        whileHover={{ scale: 1.05, rotate: 3 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`absolute inset-0 ${primaryColor.solid} opacity-20 blur-3xl rounded-full`} />
                                        <Image
                                            src={imageUrl}
                                            alt={pokemon.name}
                                            width={224}
                                            height={224}
                                            className="w-56 h-56 mx-auto relative drop-shadow-2xl object-contain"
                                            priority
                                        />
                                    </motion.div>

                                    {/* Pokemon Name */}
                                    <h1 className="text-4xl font-bold text-white capitalize mb-2">{pokemon.name}</h1>

                                    {/* Flavor Text */}
                                    {flavorText && (
                                        <p className="text-slate-400 italic text-sm mb-4 max-w-xs mx-auto">{flavorText}</p>
                                    )}

                                    {/* Type Badges */}
                                    <div className="flex justify-center gap-2">
                                        {types.map((type) => {
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

                                {/* Stats Grid - Colored */}
                                <div className="grid grid-cols-2 gap-3">
                                    <StatCard label="Height" value={`${pokemon.height / 10}m`} icon={Ruler} colorClass="text-cyan-400" />
                                    <StatCard label="Weight" value={`${pokemon.weight / 10}kg`} icon={Scale} colorClass="text-orange-400" />
                                    <StatCard label="Base XP" value={pokemon.base_experience || "N/A"} icon={TrendingUp} colorClass="text-yellow-400" />
                                    <StatCard label="Abilities" value={abilities.length} icon={Sparkles} colorClass="text-purple-400" />
                                </div>

                                {/* Abilities */}
                                {abilities.length > 0 && (
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <Target className="w-4 h-4 text-purple-400" />
                                            <span className="text-slate-400 text-sm">Abilities</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {abilities.map((ability) => (
                                                <span key={ability} className="px-3 py-1 bg-slate-800/50 rounded-full text-slate-300 text-sm">
                                                    {ability}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Right Column - Stats (7 cols) */}
                            <div className="lg:col-span-7 space-y-6">
                                {/* Base Stats */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                        Base Stats
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.map((stat) => {
                                            const statName = stat.pokemon_v2_stat.name;
                                            const displayName = statName.replace("-", " ").split(" ").map(w => capitalize(w)).join(" ");
                                            return (
                                                <div key={statName}>
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="text-slate-400">{displayName}</span>
                                                        <span className="text-white font-medium">{stat.base_stat}</span>
                                                    </div>
                                                    <ProgressBar
                                                        value={stat.base_stat}
                                                        max={255}
                                                        color={statColors[statName] || "bg-slate-500"}
                                                        showLabel={false}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Quick Stats Summary */}
                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                    >
                                        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-green-400" />
                                            HP
                                        </h3>
                                        <p className="text-3xl font-bold text-white">{hpStat}</p>
                                    </motion.div>
                                    <motion.div
                                        variants={itemVariants}
                                        className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                    >
                                        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                                            <Sword className="w-4 h-4 text-red-400" />
                                            Attack
                                        </h3>
                                        <p className="text-3xl font-bold text-white">{attackStat}</p>
                                    </motion.div>
                                </div>

                                {/* Evolution Chain or Cannot Evolve Warning */}
                                <AnimatePresence>
                                    {cannotEvolve ? (
                                        <motion.div
                                            variants={itemVariants}
                                            className="bg-slate-900/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-5"
                                        >
                                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                                <Ban className="w-5 h-5 text-yellow-400" />
                                                Evolution
                                            </h3>
                                            <div className="flex items-center gap-3 text-yellow-400/80">
                                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                                <p className="text-sm">
                                                    This special form cannot evolve. It is a unique variant of the base Pokémon.
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : evolutionChain.length > 1 && (
                                        <motion.div
                                            variants={itemVariants}
                                            className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-5"
                                        >
                                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5 text-blue-400" />
                                                Evolution Chain
                                            </h3>
                                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                                {evolutionChain.map((evo, index) => {
                                                    const evoId = evo.pokemon_v2_pokemons[0]?.id || evo.id;
                                                    const evoSprites = evo.pokemon_v2_pokemons[0]?.pokemon_v2_pokemonsprites[0]?.sprites || null;
                                                    const evoImage = getPokemonImageFromSprites(evoSprites, evoId);

                                                    return (
                                                        <div key={evo.id} className="flex items-center gap-4">
                                                            {index > 0 && (
                                                                <ArrowRight className="w-6 h-6 text-slate-500" />
                                                            )}
                                                            <Link
                                                                href={`/pokemon/${evo.name.toLowerCase()}`}
                                                                className="text-center group"
                                                            >
                                                                <motion.div
                                                                    className={cn(
                                                                        "w-20 h-20 bg-slate-800/50 border rounded-xl p-2 group-hover:border-blue-500/50 group-hover:bg-slate-800 transition-all",
                                                                        evo.name === pokemon.name ? "border-blue-500/50" : "border-white/10"
                                                                    )}
                                                                    whileHover={{ scale: 1.1 }}
                                                                >
                                                                    <Image
                                                                        src={evoImage}
                                                                        alt={evo.name}
                                                                        width={80}
                                                                        height={80}
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                </motion.div>
                                                                <p className={cn(
                                                                    "text-sm mt-2 capitalize transition-colors",
                                                                    evo.name === pokemon.name ? "text-blue-400" : "text-slate-300 group-hover:text-blue-400"
                                                                )}>
                                                                    {evo.name}
                                                                </p>
                                                            </Link>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
