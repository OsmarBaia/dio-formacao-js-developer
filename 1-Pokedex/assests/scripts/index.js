import { elementFactory } from "./elementFactory.js";
import { pokeapi } from "./pokeApi.js";

//
const pokemonsList = document.querySelector(".pokemons");

//
let offset = 0;
let limit = 30;
const pokemonMaxCount = 151;
let isSpinnerVisible = false;

function ToggleSpinner() {
  const spinner = document.querySelector(".spinner");
  if (!spinner) {
    pokemonsList.appendChild(elementFactory.CreateSpinner());
    isSpinnerVisible = true;
  } else {
    spinner.remove();
    isSpinnerVisible = false;
  }
}

async function init() {
  await fetchAndInsertPokemons(offset, limit);
}

async function fetchAndInsertPokemons(offset, limit) {
  ToggleSpinner();
  const data = await pokeapi.getPokemons(offset, limit);
  const results = data.results;
  for (const result of results) {
    const pokemonData = await pokeapi.getPokemon(result.name);
    const pokemonCard = elementFactory.CreatePokemonCard(pokemonData);
    pokemonsList.appendChild(pokemonCard);
  }
  ToggleSpinner();
}

init();

// Rolagem da Pokedex (busca esta vindo desordenada)
window.addEventListener("scroll", function (event) {
  const alturaJanela = window.innerHeight;
  const rect = pokemonsList.getBoundingClientRect();
  if (isSpinnerVisible) {
    event.preventDefault();
  } else {
    if (rect.bottom <= alturaJanela + window.scrollY) {
      if (offset + limit <= pokemonMaxCount) {
        offset += limit;

        if (offset + limit > pokemonMaxCount) {
          limit = pokemonMaxCount - offset;
        }

        if (offset < pokemonMaxCount) {
          fetchAndInsertPokemons(offset, limit);
        }
      }
    }
  }
});

// FIM Rolagem da Pokedex

// Filtros de Busca

// FIM Filtros de Busca
