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

export default function Home() {

  const [searchTerm, setSearchTerm] = useState("");

  // ใช้ useQuery hook ดึงข้อมูล pokemon พร้อมกำหนด Type
  const { loading, error, data } = useQuery<GetPokemonsData>(GET_POKEMONS);

  // กรอง Pokemon ตามคำที่ค้นหา
  const filteredPokemons = data?.pokemons?.filter((pokemon: Pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">X Pokemon Search</h1>

      {/* Search Box */}
      <div className="max-w-md mx-auto">
        <input
          type="text"
          placeholder="ค้นห้า Pokemon..."
          value={searchTerm} // ผูก Input กับ State
          onChange={(e) => setSearchTerm(e.target.value)} // update state
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
        />
      </div>

      {/* แสดงสถานะ Loading */}
      {loading && <p className="text-center text-gray-400 mt-4">กำลังโหลด...</p>}

      {/* แสดง Error */}
      {error && <p className="text-center mt-4 text-red-500">เกิดข้อผิดพลาด: {error.message}</p>}

      {/* แสดงรายชื่อ Pokemon เป็น Grid*/}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {filteredPokemons.map((pokemon: Pokemon) => (
          <Link href={`/pokemon/${pokemon.name.toLowerCase()}`} key={pokemon.id}>
            <div className="bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-700 transition cursor-pointer">
          <div key={pokemon.id} className="bg-gray-800 rounded-xl p-4 text-center hover:bg-gray-700 transition">
            <img src={pokemon.image} alt={pokemon.name} className="w-24 h-24 mx-auto" />
            <h2 className="text-lg font-semibold capitalize mt-2">{pokemon.name}</h2>
            <div className="flex justify-center gap-1 mt-2">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full inline-block mr-2"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          </div>
          </Link>
        ))}
      </div>

      {/* แสดงคำค้นหาที่พิมพ์ */}
      <div>
        <p className="text-center mt-4">
          กำลังค้นหา: {searchTerm || "..."}
        </p>
      </div>
    </div>
  );
}