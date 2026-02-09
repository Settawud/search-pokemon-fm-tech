import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// สร้าง apollo client เชื่อมต่อกับ PokeAPI GraphQL พร้อม cache optimization
const client = new ApolloClient({
    link: new HttpLink({
        uri: "https://beta.pokeapi.co/graphql/v1beta",
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
        },
        query: {
            fetchPolicy: "network-only",
        },
    },
});

export default client;