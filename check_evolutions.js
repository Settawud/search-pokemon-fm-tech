const query = `
  query {
    pokemons(first: 151) {
      name
      evolutions {
        name
      }
    }
  }
`;

// Node 18+ has native fetch
fetch('https://graphql-pokemon2.vercel.app/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
})
  .then((res) => res.json())
  .then((result) => {
    const pokemons = result.data.pokemons;
    const selfEvolving = pokemons.filter((p) => {
      if (!p.evolutions) return false;
      return p.evolutions.some((evo) => evo.name === p.name);
    });

    if (selfEvolving.length > 0) {
      console.log('Found Pokemon evolving into themselves:');
      selfEvolving.forEach(p => console.log(`- ${p.name}`));
    } else {
      console.log('No self-evolving Pokemon found.');
    }
  })
  .catch((err) => console.error(err));
