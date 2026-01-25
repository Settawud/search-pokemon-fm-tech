import { gql } from "@apollo/client";

// query ดึง pokemon 20 ตัวแรก
export const GET_POKEMONS = gql`
    query GetPokemons {
        pokemons(first:20) {
            id
            name
            image
            types

        }
    }    
`;

// query ค้นห้า Pokemon ตามชือ่
export const GET_POKEMON = gql`
    query GetPokemon($name: String!) {
        pokemon(name: $name) {
            id
            name
            image
            types
            attacks {
                fast {
                    name
                    damage
                }
            }
            maxCP
            maxHP
            weaknesses
        }    
    }    
`