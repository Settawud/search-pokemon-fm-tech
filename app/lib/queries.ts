import { gql } from "@apollo/client";

// Query ดึง Pokemon แบบ Pagination พร้อม Search และ Type Filter
export const GET_POKEMONS = gql`
    query GetPokemons($limit: Int!, $offset: Int!, $search: String, $type: String) {
        pokemon_v2_pokemon(
            limit: $limit
            offset: $offset
            order_by: { id: asc }
            where: {
                _and: [
                    { name: { _ilike: $search } }
                    { pokemon_v2_pokemontypes: { pokemon_v2_type: { name: { _eq: $type } } } }
                ]
            }
        ) {
            id
            name
            pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
            pokemon_v2_pokemonsprites {
                sprites
            }
        }
        pokemon_v2_pokemon_aggregate(
            where: {
                _and: [
                    { name: { _ilike: $search } }
                    { pokemon_v2_pokemontypes: { pokemon_v2_type: { name: { _eq: $type } } } }
                ]
            }
        ) {
            aggregate {
                count
            }
        }
    }
`;

// Query ดึง Pokemon แบบไม่มี filter (สำหรับหน้าแรก)
export const GET_ALL_POKEMONS = gql`
    query GetAllPokemons($limit: Int!, $offset: Int!) {
        pokemon_v2_pokemon(limit: $limit, offset: $offset, order_by: { id: asc }) {
            id
            name
            pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
            pokemon_v2_pokemonsprites {
                sprites
            }
        }
        pokemon_v2_pokemon_aggregate {
            aggregate {
                count
            }
        }
    }
`;

// Query ค้นหา Pokemon ตามชื่อ (สำหรับ Search)
export const SEARCH_POKEMONS = gql`
    query SearchPokemons($search: String!, $limit: Int!, $offset: Int!) {
        pokemon_v2_pokemon(
            where: { name: { _ilike: $search } }
            limit: $limit
            offset: $offset
            order_by: { id: asc }
        ) {
            id
            name
            pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
            pokemon_v2_pokemonsprites {
                sprites
            }
        }
        pokemon_v2_pokemon_aggregate(where: { name: { _ilike: $search } }) {
            aggregate {
                count
            }
        }
    }
`;

// Query ค้นหา Pokemon ตามประเภท (สำหรับ Type Filter)
export const GET_POKEMONS_BY_TYPE = gql`
    query GetPokemonsByType($type: String!, $limit: Int!, $offset: Int!) {
        pokemon_v2_pokemon(
            where: { pokemon_v2_pokemontypes: { pokemon_v2_type: { name: { _eq: $type } } } }
            limit: $limit
            offset: $offset
            order_by: { id: asc }
        ) {
            id
            name
            pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
            pokemon_v2_pokemonsprites {
                sprites
            }
        }
        pokemon_v2_pokemon_aggregate(
            where: { pokemon_v2_pokemontypes: { pokemon_v2_type: { name: { _eq: $type } } } }
        ) {
            aggregate {
                count
            }
        }
    }
`;

// Query ดึง Pokemon ตาม ID หรือชื่อ (สำหรับหน้า Detail)
export const GET_POKEMON = gql`
    query GetPokemon($name: String!) {
        pokemon_v2_pokemon(where: { name: { _eq: $name } }) {
            id
            name
            height
            weight
            base_experience
            pokemon_v2_pokemontypes {
                pokemon_v2_type {
                    name
                }
            }
            pokemon_v2_pokemonstats {
                base_stat
                pokemon_v2_stat {
                    name
                }
            }
            pokemon_v2_pokemonabilities {
                pokemon_v2_ability {
                    name
                }
            }
            pokemon_v2_pokemonsprites {
                sprites
            }
            pokemon_v2_pokemonspecy {
                pokemon_v2_evolutionchain {
                    pokemon_v2_pokemonspecies(order_by: { order: asc }) {
                        id
                        name
                        order
                        pokemon_v2_pokemons(limit: 1) {
                            id
                            pokemon_v2_pokemonsprites {
                                sprites
                            }
                        }
                    }
                }
                pokemon_v2_pokemonspeciesflavortexts(
                    where: { language_id: { _eq: 9 } }
                    limit: 1
                ) {
                    flavor_text
                }
            }
        }
    }
`;