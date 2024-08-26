import { elementFactory } from "./elementFactory.js";
import { spinner } from "./spinner.js";

export class pokeapi {
  static async getPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const response = await fetch(url);
    return await response.json();
  }

  static async getPokemons(offset = 0, limit = 20) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    return await response.json();
  }

  static async fetchAPokemonCard(pokemonRef) {
    const pokemonData = await pokeapi.getPokemon(pokemonRef);
    const pokemonCard = elementFactory.CreatePokemonCard(pokemonData);
    return pokemonCard;
  }

  static async fetchAndInsertPokemons(offset, limit) {
    const pokemonsList = document.querySelector(".pokemons");

    spinner.ToggleSpinnerAt();
    const data = await pokeapi.getPokemons(offset, limit);
    const results = data.results;
    for (const result of results) {
      pokemonsList.appendChild(await pokeapi.fetchAPokemonCard(result.name));
    }
    spinner.ToggleSpinnerAt();
  }
}
