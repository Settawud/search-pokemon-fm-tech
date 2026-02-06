import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// สร้าง apollo client เชื่อมต่อกับ PokeAPI GraphQL พร้อม cache optimization
const client = new ApolloClient({
    link: new HttpLink({
        uri: "https://beta.pokeapi.co/graphql/v1beta",
    }),
    cache: new InMemoryCache({
        typePolicies: {
            // Cache Pokemon by ID for faster lookups
            pokemon_v2_pokemon: {
                keyFields: ["id"],
            },
            // Cache Pokemon species
            pokemon_v2_pokemonspecies: {
                keyFields: ["id"],
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-first",
            nextFetchPolicy: "cache-first",
        },
        query: {
            fetchPolicy: "cache-first",
        },
    },
});

export default client;