"use client"; // บอกว่าเป็น client component

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_POKEMONS } from "./lib/queries";
import Link from "next/link";

// กำหนด Type ข้อมูล Pokemon
interface Pokemon {
  id: string;
  name: string;
  image: string;
  types: string[];
}

// กำหนด Type สำหรับ Query Response
interface GetPokemonsData {
  pokemons: Pokemon[];
}

// Type color mapping
const typeColors: Record<string, { bg: string; text: string }> = {
  Grass: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  Poison: { bg: "bg-purple-500/15", text: "text-purple-400" },
  Fire: { bg: "bg-red-500/15", text: "text-red-400" },
  Water: { bg: "bg-blue-500/15", text: "text-blue-400" },
  Electric: { bg: "bg-yellow-500/15", text: "text-yellow-400" },
  Psychic: { bg: "bg-pink-500/15", text: "text-pink-400" },
  Ice: { bg: "bg-cyan-500/15", text: "text-cyan-400" },
  Dragon: { bg: "bg-violet-500/15", text: "text-violet-400" },
  Dark: { bg: "bg-slate-500/15", text: "text-slate-400" },
  Fairy: { bg: "bg-pink-400/15", text: "text-pink-300" },
  Fighting: { bg: "bg-orange-500/15", text: "text-orange-400" },
  Flying: { bg: "bg-indigo-400/15", text: "text-indigo-300" },
  Ground: { bg: "bg-amber-600/15", text: "text-amber-500" },
  Rock: { bg: "bg-stone-500/15", text: "text-stone-400" },
  Bug: { bg: "bg-lime-500/15", text: "text-lime-400" },
  Ghost: { bg: "bg-violet-600/15", text: "text-violet-400" },
  Steel: { bg: "bg-slate-400/15", text: "text-slate-300" },
  Normal: { bg: "bg-gray-500/15", text: "text-gray-400" },
};

const getTypeStyle = (type: string) => {
  return typeColors[type] || { bg: "bg-slate-500/15", text: "text-slate-400" };
};

export default function Home() {

  const [searchTerm, setSearchTerm] = useState("");

  // ใช้ useQuery hook ดึงข้อมูล pokemon พร้อมกำหนด Type
  const { loading, error, data } = useQuery<GetPokemonsData>(GET_POKEMONS);

  // กรอง Pokemon ตามคำที่ค้นหา
  const filteredPokemons = data?.pokemons?.filter((pokemon: Pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <header className="pt-12 pb-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Pokémon Database
          </h1>
          <p className="text-slate-400 text-lg">
            Explore the complete Pokédex with detailed stats and information
          </p>
        </div>
      </header>

      {/* Search Section */}
      <div className="px-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Pokémon by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {/* Search Results Count */}
          {searchTerm && (
            <p className="text-slate-400 text-sm mt-3 text-center">
              Found <span className="text-blue-400 font-medium">{filteredPokemons.length}</span> Pokémon matching "{searchTerm}"
            </p>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 mt-4">Loading Pokémon...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
          <p className="text-slate-400">{error.message}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredPokemons.length === 0 && searchTerm && (
        <div className="max-w-md mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Pokémon found</h3>
          <p className="text-slate-400">Try searching with a different name</p>
        </div>
      )}

      {/* Pokemon Grid */}
      {!loading && !error && filteredPokemons.length > 0 && (
        <div className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredPokemons.map((pokemon: Pokemon) => (
                <Link href={`/pokemon/${pokemon.name.toLowerCase()}`} key={pokemon.id}>
                  <div className="glass-card group cursor-pointer hover-lift p-4 text-center animate-fade-in">
                    {/* Pokemon Image */}
                    <div className="relative mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-24 h-24 mx-auto relative img-zoom"
                      />
                    </div>

                    {/* Pokemon Name */}
                    <h2 className="text-white font-semibold capitalize mb-2 group-hover:text-blue-400 transition-colors">
                      {pokemon.name}
                    </h2>

                    {/* Type Badges */}
                    <div className="flex flex-wrap justify-center gap-1">
                      {pokemon.types.map((type) => {
                        const style = getTypeStyle(type);
                        return (
                          <span
                            key={type}
                            className={`${style.bg} ${style.text} text-xs px-2 py-0.5 rounded-full font-medium`}
                          >
                            {type}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>Dev by Bbest</p>
      </footer>
    </div>
  );
}