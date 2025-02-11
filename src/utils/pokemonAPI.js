// Constants
export const ITEMS_PER_PAGE = 20;
export const BASE_API_URL = "https://pokeapi.co/api/v2";

const fetchJson = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error(`Fetch failed: ${error.message}`);
    throw error;
  }
};

export const pokemonApi = {
  fetchPokemonList: (offset) =>
    fetchJson(
      `${BASE_API_URL}/pokemon/?offset=${offset}&limit=${ITEMS_PER_PAGE}`
    ),

  fetchPokemonDetail: (url) => fetchJson(url),

  fetchPokemonByType: (type) => fetchJson(`${BASE_API_URL}/type/${type}`),

  fetchPokemonByName: async (name) => {
    try {
      const [species, details] = await Promise.all([
        fetchJson(`${BASE_API_URL}/pokemon-species/${name}/`),
        fetchJson(`${BASE_API_URL}/pokemon/${name}`),
      ]);
      return details;
    } catch (error) {
      console.error(`Error fetching Pokémon by name: ${name}`, error);
      throw error;
    }
  },
};
