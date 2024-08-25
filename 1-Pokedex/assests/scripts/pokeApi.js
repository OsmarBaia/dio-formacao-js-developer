export class pokeapi {
  static getPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    return fetch(url).then((response) => response.json());
  }

  static getPokemons(offset = 0, limit = 20) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url).then((response) => response.json());
  }
}
