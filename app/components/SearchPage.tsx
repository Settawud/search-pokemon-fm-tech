"use client";

import { useState, useEffect, Suspense, useCallback, useRef, useMemo } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { GET_ALL_POKEMONS, SEARCH_POKEMONS, GET_POKEMONS_BY_TYPE } from "../lib/queries";
import { useDebounce } from "../hooks/useDebounce";
import { useSearchStats } from "../hooks/useSearchStats";
import { PokemonCard } from "./PokemonCard";
import { SearchInput } from "./SearchInput";
import { PokemonGridSkeleton } from "./Skeleton";
import { SearchX, Filter, Loader2 } from "lucide-react";
import { Pokeball } from "./Pokeball";
import { extractTypes, formatPokemonNumber, capitalize, getPokemonImage, transformPokemon, type Pokemon, type PokeAPIPokemon } from "../lib/utils";
import { TypeFilterChips } from "./TypeFilterChips"; // Not dynamic anymore for immediate interactivity if possible, or keep dynamic if heavy

// Dynamic imports for non-critical components
const TopSearchedPokemon = dynamic(() => import("./TopSearchedPokemon").then(mod => ({ default: mod.TopSearchedPokemon })), {
    ssr: false,
    loading: () => null
});

const ITEMS_PER_PAGE = 30;



// Page transition variants
const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
};

interface SearchPageProps {
    initialPokemons: Pokemon[];
    initialTotalCount: number;
}

export function SearchPage({ initialPokemons, initialTotalCount }: SearchPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState(searchParams.get("name") || "");
    const [selectedType, setSelectedType] = useState<string | null>(
        searchParams.get("type") || null
    );
    const [showFilters, setShowFilters] = useState(true);

    // Initialize with passed props
    const [displayedPokemons, setDisplayedPokemons] = useState<Pokemon[]>(initialPokemons);
    const [totalCount, setTotalCount] = useState(initialTotalCount);
    const [hasMore, setHasMore] = useState(initialPokemons.length < initialTotalCount);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 300);
    const offsetRef = useRef(initialPokemons.length); // Start offset after initial data

    // Search Statistics Hook
    const { recordSearch, getPopularSearches, getRecentSearches } = useSearchStats();
    const popularSearches = getPopularSearches(10);

    // Lazy Queries for dynamic fetching (client-side navigation/filtering)
    // Note: We only use these for SUBSEQUENT fetches or filtering changes
    interface QueryData {
        pokemon_v2_pokemon: PokeAPIPokemon[];
        pokemon_v2_pokemon_aggregate: {
            aggregate: {
                count: number;
            };
        };
    }

    const [fetchAll, { loading: loadingAll }] = useLazyQuery<QueryData>(GET_ALL_POKEMONS);
    const [fetchSearch, { loading: loadingSearch }] = useLazyQuery<QueryData>(SEARCH_POKEMONS);
    const [fetchByType, { loading: loadingType }] = useLazyQuery<QueryData>(GET_POKEMONS_BY_TYPE);

    const loading = loadingAll || loadingSearch || loadingType;

    // Determine which query to use
    const queryMode = useMemo(() => {
        if (debouncedSearch) return "search";
        if (selectedType) return "type";
        return "all";
    }, [debouncedSearch, selectedType]);

    // Fetch Pokemon based on current mode
    const fetchPokemons = useCallback(async (offset: number, append: boolean = false) => {
        if (append) {
            setIsLoadingMore(true);
        }

        try {
            let result;

            // Variables now exclude sprites if query optimized? 
            // We will perform query optimization in separate step, but logic remains same.

            if (queryMode === "search") {
                result = await fetchSearch({
                    variables: {
                        search: `%${debouncedSearch}%`,
                        limit: ITEMS_PER_PAGE,
                        offset
                    }
                });
            } else if (queryMode === "type") {
                result = await fetchByType({
                    variables: {
                        type: selectedType!.toLowerCase(),
                        limit: ITEMS_PER_PAGE,
                        offset
                    }
                });
            } else {
                result = await fetchAll({
                    variables: { limit: ITEMS_PER_PAGE, offset }
                });
            }

            if (result.data?.pokemon_v2_pokemon) {
                const newPokemons = result.data.pokemon_v2_pokemon.map(transformPokemon);
                const count = result.data.pokemon_v2_pokemon_aggregate?.aggregate?.count || 0;

                setTotalCount(count);

                if (append) {
                    setDisplayedPokemons(prev => [...prev, ...newPokemons]);
                } else {
                    setDisplayedPokemons(newPokemons);
                }

                setHasMore(offset + newPokemons.length < count);
            }
        } catch (err) {
            console.error("Error fetching Pokemon:", err);
        } finally {
            setIsLoadingMore(false);
        }
    }, [queryMode, debouncedSearch, selectedType, fetchAll, fetchSearch, fetchByType]);

    // Reset and fetch when search/filter changes
    // IMPORTANT: We need to skip this on initial render if we have initialData AND search params match (Complex, easier to just let it run if params change, or check if params differ from initial).
    // For simplicity: If initial load covers the state, don't re-fetch.

    const isFirstRender = useRef(true);

    useEffect(() => {
        // If it's the very first render and we have initial data matching the URL (which we assume from SSR), skip.
        // However, user might have just navigated here.
        // If search/type changes from what passed in props, we fetch.

        if (isFirstRender.current) {
            isFirstRender.current = false;
            // If query params exist, SSR likely handled them (if we implement SSR with params). 
            // If we only SSR "All" state, then we might need to fetch if URL has params.
            // Assuming we SSR based on URL params in page.tsx:
            return;
        }

        offsetRef.current = 0;
        // Clearing list is optional visual preference, maybe keep old results until new ones load?
        // setDisplayedPokemons([]); 
        setHasMore(true);
        fetchPokemons(0, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, selectedType]);


    // Load more Pokemon
    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore || loading) return;

        const newOffset = offsetRef.current;
        // offsetRef should be updated to displayedPokemons.length actually to be safe
        // or keep track manually.
        const currentLength = displayedPokemons.length;

        await fetchPokemons(currentLength, true);
        // Update offset ref after fetch success? Or just use length.
        offsetRef.current = currentLength + ITEMS_PER_PAGE;

    }, [fetchPokemons, hasMore, isLoadingMore, loading, displayedPokemons.length]);

    // Intersection Observer for Infinite Scroll - using callback ref pattern
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Store latest values in refs to avoid stale closures
    const hasMoreRef = useRef(hasMore);
    const isLoadingMoreRef = useRef(isLoadingMore);
    const loadingRef = useRef(loading);
    const loadMoreFnRef = useRef(loadMore);

    useEffect(() => {
        hasMoreRef.current = hasMore;
        isLoadingMoreRef.current = isLoadingMore;
        loadingRef.current = loading;
        loadMoreFnRef.current = loadMore;
    }, [hasMore, isLoadingMore, loading, loadMore]);

    // Callback ref - this will be called when the element mounts/unmounts
    const setLoadMoreRef = useCallback((node: HTMLDivElement | null) => {
        // Disconnect previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // If node exists, set up new observer
        if (node) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (entry.isIntersecting && hasMoreRef.current && !isLoadingMoreRef.current && !loadingRef.current) {
                        loadMoreFnRef.current();
                    }
                },
                { threshold: 0.1, rootMargin: "300px" }
            );

            observerRef.current.observe(node);
        }
    }, []);

    // Sync search term with URL
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) {
            params.set("name", debouncedSearch);
        }
        if (selectedType) {
            params.set("type", selectedType);
        }

        if (params.toString()) {
            router.replace(`?${params.toString()}`, { scroll: false });
        } else {
            router.replace("/", { scroll: false });
        }
    }, [debouncedSearch, selectedType, router]);

    // Handle Pokemon card click - record search stats
    const handlePokemonClick = useCallback((pokemonName: string) => {
        recordSearch(pokemonName);
    }, [recordSearch]);

    // Handle popular search click - auto-fill search
    const handlePopularSearchClick = useCallback((query: string) => {
        setSearchTerm(query);
    }, []);

    // Check if we're in "home" state (no search, no filter)
    const isHomeState = !debouncedSearch && !selectedType;

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {/* Mesh Gradient Background - Simplified for performance? keeping for now */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl transform-gpu" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transform-gpu" />
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl transform-gpu" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header - Fixed Feel */}
                <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                    <div className="max-w-6xl mx-auto px-6 py-6">
                        {/* Title */}
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex items-center justify-center gap-2 mb-2"
                            >
                                <Pokeball className="w-10 h-10" />
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Search Pokédex
                                </h1>
                            </motion.div>
                            <motion.p
                                className="text-slate-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Explore all {totalCount > 0 ? totalCount.toLocaleString() : "1000+"} Pokémon
                            </motion.p>
                        </div>

                        {/* Search Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-md mx-auto"
                        >
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search by name..."
                            />

                            {/* Results Count */}
                            <AnimatePresence mode="wait">
                                {(debouncedSearch || selectedType) && !loading && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="text-slate-400 text-sm mt-3 text-center"
                                    >
                                        Found <span className="text-blue-400 font-medium">{displayedPokemons.length}</span> of <span className="text-purple-400">{totalCount}</span> Pokémon
                                        {debouncedSearch && <> matching &quot;{debouncedSearch}&quot;</>}
                                        {selectedType && <> of type <span className="text-purple-400">{selectedType}</span></>}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Filter Toggle Button */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center mt-4"
                        >
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all text-sm"
                            >
                                <Filter className="w-4 h-4" />
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </button>
                        </motion.div>

                        {/* Type Filter Chips */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4 overflow-hidden"
                                >
                                    <TypeFilterChips
                                        selectedType={selectedType}
                                        onTypeChange={setSelectedType}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Main Content */}
                <main className="px-6 py-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Top Searched Pokemon - Netflix Style */}
                        {isHomeState && !loading && displayedPokemons.length > 0 && popularSearches.length > 0 && (
                            <TopSearchedPokemon
                                topSearches={popularSearches}
                                allPokemons={displayedPokemons}
                                onPokemonClick={handlePokemonClick}
                                className="mb-8"
                            />
                        )}

                        {/* Loading State - Skeleton (Initial Load Only) */}
                        {loading && displayedPokemons.length === 0 && <PokemonGridSkeleton count={18} />}

                        {/* Error State */}
                        {!loading && displayedPokemons.length === 0 && (debouncedSearch || selectedType) && (
                            <motion.div
                                className="max-w-md mx-auto py-20 text-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="w-20 h-20 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">🔍</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">No Pokémon found</h3>
                                <p className="text-slate-400">
                                    Try searching with a different name or type
                                </p>
                            </motion.div>
                        )}

                        {/* Pokemon Grid */}
                        {displayedPokemons.length > 0 && (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {displayedPokemons.map((pokemon: Pokemon, index: number) => (
                                        <PokemonCard
                                            key={pokemon.id}
                                            name={pokemon.name}
                                            image={pokemon.image}
                                            types={pokemon.types}
                                            index={index}
                                            number={pokemon.number}
                                            onNavigate={handlePokemonClick}
                                        />
                                    ))}
                                </div>

                                {/* Infinite Scroll Trigger */}
                                <div ref={setLoadMoreRef} className="py-10 flex justify-center">
                                    {isLoadingMore && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center gap-4"
                                        >
                                            {/* 3 Bouncing Pokeballs */}
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ y: [0, -12, 0] }}
                                                    transition={{
                                                        duration: 0.6,
                                                        repeat: Infinity,
                                                        delay: i * 0.15,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="w-8 h-8 rounded-full bg-gradient-to-b from-red-500 to-red-600 relative overflow-hidden shadow-lg shadow-red-500/30"
                                                >
                                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                                                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2" />
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-800" />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                    {!hasMore && displayedPokemons.length > 0 && (
                                        <motion.p
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-lg font-semibold text-center bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                                        >
                                            🎉 เจอ Pokémon ครบ {displayedPokemons.length} ตัวแล้ว! 🎉
                                        </motion.p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-8 mt-auto border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-4">
                        <div className="text-slate-400 text-sm">
                            <p>
                                © 2026 Developed by{" "}
                                <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Bbest
                                </span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </motion.div>
    );
}
