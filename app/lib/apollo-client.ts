import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// สร้าง apollo client เชื่อมต่อกับ PokeAPI GraphQL
const client = new ApolloClient({
    link: new HttpLink({
        uri: "https://beta.pokeapi.co/graphql/v1beta", // PokeAPI GraphQL - มี Pokemon ครบทุกตัว
    }),
    cache: new InMemoryCache(), // เก็บ cache เพื่อไม่ต้องโหลดซ้ำ
});

export default client;