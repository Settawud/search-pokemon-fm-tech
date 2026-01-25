import { render, screen } from '@testing-library/react'
import { PokemonCard } from '../app/components/PokemonCard'

// Mock generic utils if necessary (though simple enough to not need mocks)
// Assuming we want to verify that the rendered card contains the Pokemon Type text

describe('PokemonCard Type Verification', () => {
    it('Bulbasaur should be Grass type', () => {
        render(
            <PokemonCard
                name="Bulbasaur"
                image="img/bulbasaur.png"
                types={['Grass', 'Poison']}
                index={0}
                number="001"
            />
        )

        const typeBadge = screen.getByText('Grass')
        expect(typeBadge).toBeInTheDocument()
    })

    it('Charmander should be Fire type', () => {
        render(
            <PokemonCard
                name="Charmander"
                image="img/charmander.png"
                types={['Fire']}
                index={0}
                number="004"
            />
        )

        const typeBadge = screen.getByText('Fire')
        expect(typeBadge).toBeInTheDocument()
    })

    it('Squirtle should be Water type', () => {
        render(
            <PokemonCard
                name="Squirtle"
                image="img/squirtle.png"
                types={['Water']}
                index={0}
                number="007"
            />
        )

        const typeBadge = screen.getByText('Water')
        expect(typeBadge).toBeInTheDocument()
    })
})
