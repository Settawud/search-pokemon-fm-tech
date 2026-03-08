import { Metadata } from "next";
import { print } from "graphql";
import { notFound } from "next/navigation";
import { GET_POKEMON } from "../../lib/queries";
import { capitalize, getPokemonImageFromSprites } from "../../lib/utils";
import PokemonDetailClient from "./PokemonDetailClient";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

interface PageProps {
    params: Promise<{ name: string }>;
}

async function fetchPokemonData(name: string) {
    try {
        const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: print(GET_POKEMON),
                variables: { name: name.toLowerCase() },
            }),
            next: { revalidate: 60 },
        });

        const { data } = await response.json();
        return data?.pokemon_v2_pokemon?.[0] || null;
    } catch (error) {
        console.error("Failed to fetch pokemon:", error);
        return null;
    }
}

// Dynamic metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { name } = await params;
    const pokemon = await fetchPokemonData(name);

    if (!pokemon) {
        return {
            title: "Pokémon Not Found | Pokémon Search",
            description: "The requested Pokémon could not be found.",
        };
    }

    const types = pokemon.pokemon_v2_pokemontypes
        .map((t: { pokemon_v2_type: { name: string } }) => capitalize(t.pokemon_v2_type.name))
        .join(", ");
    const pokemonName = capitalize(pokemon.name);
    const sprites = pokemon.pokemon_v2_pokemonsprites[0]?.sprites || null;
    const imageUrl = getPokemonImageFromSprites(sprites, pokemon.id);
    const flavorText = pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts?.[0]?.flavor_text?.replace(/\n|\f/g, " ") || "";
    const description = flavorText
        ? `${pokemonName} - ${types} type Pokémon. ${flavorText}`
        : `${pokemonName} - ${types} type Pokémon. View stats, abilities, evolution chain and more.`;

    return {
        title: `${pokemonName} | Pokémon Search`,
        description,
        openGraph: {
            title: `${pokemonName} | Pokémon Search`,
            description,
            images: [{ url: imageUrl, width: 475, height: 475, alt: pokemonName }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${pokemonName} | Pokémon Search`,
            description,
            images: [imageUrl],
        },
    };
}

export default async function PokemonDetailPage({ params }: PageProps) {
    const { name } = await params;
    const pokemon = await fetchPokemonData(name);

    if (!pokemon) {
        notFound();
    }

    return <PokemonDetailClient pokemon={pokemon} />;
}
