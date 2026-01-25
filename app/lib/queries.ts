import { gql } from "@apollo/client";

// query ดึง pokemon 20 ตัวแรก
export const GET_POKEMONS = gql`
    query GetPokemons {
        pokemons(first:151) {
            id
            number
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
            number
            classification
            fleeRate
            maxCP
            maxHP
            weaknesses
            weight {
                minimum
                maximum
            }
            height {
                minimum
                maximum
            }
            evolutions {
                id
                number
                name
                image
            }
            resistant
            attacks {
                fast {
                    name
                    damage
                    type
                }
                special {
                    name
                    damage
                    type
                }
            }
            evolutionRequirements {
                amount
                name
            }
        }    
    }    
`