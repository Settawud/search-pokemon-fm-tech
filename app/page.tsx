import { Suspense } from "react";
import { SearchPage } from "./components/SearchPage";
import { PokemonGridSkeleton } from "./components/Skeleton";
import { GET_ALL_POKEMONS } from "./lib/queries";
import { transformPokemon, PokeAPIPokemon } from "./lib/utils";
import { print } from "graphql";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

async function getInitialPokemons() {
  try {
    const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: print(GET_ALL_POKEMONS),
        variables: { limit: 30, offset: 0 },
      }),
      next: { revalidate: 60 },
    });

    const { data } = await response.json();

    if (!data?.pokemon_v2_pokemon) {
      return {
        initialPokemons: [],
        initialTotalCount: 0,
      };
    }

    const initialPokemons = data.pokemon_v2_pokemon.map((p: PokeAPIPokemon) => transformPokemon(p));
    const initialTotalCount = data.pokemon_v2_pokemon_aggregate?.aggregate?.count || 0;

    return {
      initialPokemons,
      initialTotalCount,
    };
  } catch (error) {
    console.error("Failed to fetch initial pokemons:", error);
    return {
      initialPokemons: [],
      initialTotalCount: 0,
    };
  }
}

export default async function Home() {
  const { initialPokemons, initialTotalCount } = await getInitialPokemons();

  return (
    <Suspense fallback={<PokemonGridSkeleton count={18} />}>
      <SearchPage
        initialPokemons={initialPokemons}
        initialTotalCount={initialTotalCount}
      />
    </Suspense>
  );
}