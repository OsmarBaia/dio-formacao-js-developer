import { elementFactory } from "./elementFactory.js";
import { pokeapi } from "./pokeApi.js";

//
const pokemonsList = document.querySelector(".pokemons");

//
let offset = 0;
let limit = 30;
const pokemonMaxCount = 151;

async function init() {
  pokemonsList.appendChild(elementFactory.CreateSpinner());
  await fetchAndInsertPokemons(offset, limit);
}

async function fetchAndInsertPokemons(offset, limit) {
  const data = await pokeapi.getPokemons(offset, limit);
  const results = data.results;
  for (const result of results) {
    const pokemonData = await pokeapi.getPokemon(result.name);
    const pokemonCard = elementFactory.CreatePokemonCard(pokemonData);
    pokemonsList.appendChild(pokemonCard);
  }
  elementFactory.RemoveSpinner();
}

init();

// Rolagem da Pokedex (busca esta vindo desordenada)

window.addEventListener("scroll", function (event) {
  const alturaJanela = window.innerHeight;
  const rect = pokemonsList.getBoundingClientRect();
  if (elementFactory.isSpinnerVisible) {
    event.preventDefault();
  } else {
    if (rect.bottom <= alturaJanela + window.scrollY) {
      pokemonsList.appendChild(CreateSpinner());
      if (offset + limit <= pokemonMaxCount) {
        offset += limit;

        if (offset + limit > pokemonMaxCount) {
          limit = pokemonMaxCount - offset;
        }

        if (offset < pokemonMaxCount) {
          fetchPokemonsInRange(offset, limit);
        }
      }
    }
  }
});

// FIM Rolagem da Pokedex

// Filtros de Busca

// FIM Filtros de Busca
