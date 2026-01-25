"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_POKEMON } from "../../lib/queries";
import Link from "next/link";

// Type สำหรับ Attack
interface Attack {
    name: string;
    damage: number;
}

// Type สำหรับ Pokemon
interface Pokemon {
    id: string;
    name: string;
    image: string;
    types: string[];
    attacks: {
        fast: Attack[];
    };
    maxCP: number;
    maxHP: number;
    weaknesses: string[];
}



// Type สำหรับ Query Response
interface GetPokemonData {
    pokemon: Pokemon;
}

export default function PokemonDetail() {
    // ดึง parameter จาก URL
    const params = useParams();
    const name = params.name as string;

    // Query Pokemon ตามชื่อ
    const { loading, error, data } = useQuery<GetPokemonData>(GET_POKEMON, {
        variables: { name }, // ส่ง variable ไปกับ query
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p className="text-xl"> กำลังโหลด ...</p>
            </div>
        );
    }

    if (error || !data?.pokemon) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p className="text-red-500">Not found Pokemon: {name}</p>
            </div>
        );
    }

    const pokemon = data.pokemon;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            {/* Back Button */}
            <Link href="/" className="text-yellow-400 hover:underline mb-4 inline-block">
                ↩ กลับหน้าหลัก
            </Link>

            {/* Pokemon Card */}
            <div className="max-w-md mx-auto bg-gray-800 rounded-2xl p-8 text-center">
                <img src={pokemon.image} alt={pokemon.name} className="w-48 h-48 mx-auto" />
                <h1 className="text-3xl font-bold mb-4">{pokemon.name}</h1>
                <div>
                    <p className="text-gray-400 text-sm">Max CP</p>
                    <p className="text-yellow-400 font-bold text-xl">{pokemon.maxCP}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Max HP</p>
                    <p className="text-green-400 font-bold text-xl">{pokemon.maxHP}</p>
                </div>
            </div>

            {/* Pokemon Types */}
            <div className="flex justify-center gap-2 mt-4">
                {pokemon.types.map((type) => (
                    <span
                        key={type}
                        className="bg-yellow-500 text-black px-3 py-1 rounded-full font-medium">
                        {type}
                    </span>
                ))}
            </div>

            {/* Pokemon Attacks */}
            <div className="mt-6 text-left">
                <h2 className="text-xl font-semibold mb-2">
                    ⚡️ Fast Attacks
                </h2>
                <ul className="space-y-2">
                    {pokemon.attacks?.fast?.map((attack) => (
                        <li
                            key={attack.name}
                            className="bg-gray-700 px-4 py-2 rounded-lg flex justify-between"
                        >
                            <span>
                                {attack.name}
                            </span>
                            <span
                                className="text-yellow-400">
                                {attack.damage} DMG
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
