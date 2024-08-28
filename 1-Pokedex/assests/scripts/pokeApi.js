import {elementFactory} from "./elementFactory.js";
import {spinner} from "./spinner.js";

export class pokeapi {
  static pokemonMaxCount = 151;
  static async getPokemon(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const response = await fetch(url);
    return await response.json();
  }

  static async getPokemonsInRange(offset = 0, limit = 20) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    return await response.json();
  }

  static async getOnePokemonCard(pokemonRef) {
    const pokemonData = await this.getPokemon(pokemonRef);
    return elementFactory.CreatePokemonCard(pokemonData);
  }

  //Refatorar
  static async fetchAndInsertPokemons(offset, limit) {
    const pokemonsList = document.querySelector(".pokemons");

    spinner.ToggleSpinnerAt(pokemonsList);
    const data = await this.getPokemonsInRange(offset, limit);
    const results = data.results;
    for (const result of results) {
      pokemonsList.appendChild(await this.getOnePokemonCard(result.name));
    }
    spinner.ToggleSpinnerAt(pokemonsList);
  }

  static async getAllPokemons() {
    return await this.getPokemonsInRange(0, this.pokemonMaxCount);
  }
}
