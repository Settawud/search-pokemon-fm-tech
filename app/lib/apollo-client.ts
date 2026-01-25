import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// สร้าง apollo client เชื่อมต่อกับ GraphQL API
const client = new ApolloClient({
    link: new HttpLink({
        uri: "https://graphql-pokemon2.vercel.app/", // URL ของ Pokemon API
    }),
    cache: new InMemoryCache(), // เก็บ cache เพื่อไม่ต้องโหลดซ้ำ
});

export default client;