"use client"; // บอกว่าเป็น client component

import { useState, useEffect, Suspense } from "react";
import { useQuery } from "@apollo/client/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GET_POKEMONS } from "./lib/queries";
import { useDebounce } from "./hooks/useDebounce";
import { PokemonCard } from "./components/PokemonCard";
import { SearchInput } from "./components/SearchInput";
import { PokemonGridSkeleton } from "./components/Skeleton";
import { SearchX } from "lucide-react";
import { Pokeball } from "./components/Pokeball";

// กำหนด Type ข้อมูล Pokemon
interface Pokemon {
  id: string;
  name: string;
  image: string;
  types: string[];
  number: string;
}

// กำหนด Type สำหรับ Query Response
interface GetPokemonsData {
  pokemons: Pokemon[];
}

// Page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search term from URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get("name") || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // ใช้ useQuery hook ดึงข้อมูล pokemon พร้อมกำหนด Type
  const { loading, error, data } = useQuery<GetPokemonsData>(GET_POKEMONS);

  // Sync search term with URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) {
      params.set("name", debouncedSearch);
      router.replace(`?${params.toString()}`, { scroll: false });
    } else {
      router.replace("/", { scroll: false });
    }
  }, [debouncedSearch, router]);

  // กรอง Pokemon ตามคำที่ค้นหา
  const filteredPokemons = data?.pokemons?.filter((pokemon: Pokemon) =>
    pokemon.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
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
                  Search Pokemon FM Tech
                </h1>
              </motion.div>
              <motion.p
                className="text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Explore the complete Pokédex with detailed stats
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
                {debouncedSearch && !loading && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-slate-400 text-sm mt-3 text-center"
                  >
                    Found <span className="text-blue-400 font-medium">{filteredPokemons.length}</span> Pokémon matching &quot;{debouncedSearch}&quot;
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Loading State - Skeleton */}
            {loading && <PokemonGridSkeleton count={18} />}

            {/* Error State */}
            {error && (
              <motion.div
                className="max-w-md mx-auto py-20 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchX className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
                <p className="text-slate-400">{error.message}</p>
              </motion.div>
            )}

            {/* Empty State */}
            <AnimatePresence mode="wait">
              {!loading && !error && filteredPokemons.length === 0 && debouncedSearch && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="max-w-md mx-auto py-20 text-center"
                >
                  <div className="w-20 h-20 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Pokémon found</h3>
                  <p className="text-slate-400">
                    Try searching with a different name
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pokemon Grid */}
            {!loading && !error && filteredPokemons.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredPokemons.map((pokemon: Pokemon, index: number) => (
                  <PokemonCard
                    key={pokemon.id}
                    name={pokemon.name}
                    image={pokemon.image}
                    types={pokemon.types}
                    index={index}
                    number={pokemon.number}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 mt-auto border-t border-white/5 bg-slate-950/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-4">

            {/* Left: Copyright & Name */}
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

export default function Home() {
  return (
    <Suspense fallback={<PokemonGridSkeleton count={18} />}>
      <SearchPageContent />
    </Suspense>
  );
}