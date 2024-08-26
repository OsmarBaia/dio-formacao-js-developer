import { elementFactory } from "./elementFactory.js";
import { spinner } from "./spinner.js";

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
    const pokemonCard = elementFactory.CreatePokemonCard(pokemonData);
    return pokemonCard;
  }

  //Refatorar
  static async fetchAndInsertPokemons(offset, limit) {
    const pokemonsList = document.querySelector(".pokemons");

    spinner.ToggleSpinnerAt();
    const data = await this.getPokemonsInRange(offset, limit);
    const results = data.results;
    for (const result of results) {
      pokemonsList.appendChild(await this.getOnePokemonCard(result.name));
    }
    spinner.ToggleSpinnerAt();
  }

  static async getAllPokemons() {
    return await this.getPokemonsInRange(0, this.pokemonMaxCount);
  }

  static async getAllPokemonsOfType(type) {
    const data = await this.getAllPokemons();
    const results = data.results;
    const pokemons = [];
    for (const result of results) {
      const pokemon = await this.getPokemon(result.name);
      pokemon.types.forEach((pokeType) => {
        if (pokeType.type.name === type) {
          pokemons.push(pokemon);
          return;
        }
      });
    }
    return pokemons;
  }
}
