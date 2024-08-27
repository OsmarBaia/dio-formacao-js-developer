import { pokeapi } from "./pokeApi.js";

async function loadPokemonDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonRef = urlParams.get("id");
  console.log(pokemonRef);
  const data = await pokeapi.getPokemon(pokemonRef);
  console.log(data);
}

loadPokemonDetails();
