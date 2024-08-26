import { pokeapi } from "./pokeApi.js";
import { spinner } from "./spinner.js";
import { isFiltering } from "./filter.js";

//
const pokemonsList = document.querySelector(".pokemons");
//
let offset = 0;
let limit = 30;
const pokemonMaxCount = 151;

async function init() {
  await pokeapi.fetchAndInsertPokemons(offset, limit);
}

init();

// Rolagem da Pokedex (busca esta vindo desordenada)

window.addEventListener("scroll", function (event) {
  const alturaJanela = window.innerHeight;
  const rect = pokemonsList.getBoundingClientRect();
  if (spinner.isSpinnerVisible || isFiltering) {
    event.preventDefault();
  } else {
    if (rect.bottom <= alturaJanela + window.scrollY) {
      if (offset + limit <= pokemonMaxCount) {
        offset += limit;

        if (offset + limit > pokemonMaxCount) {
          limit = pokemonMaxCount - offset;
        }

        if (offset < pokemonMaxCount) {
          pokeapi.fetchAndInsertPokemons(offset, limit);
        }
      }
    }
  }
});

// FIM Rolagem da Pokedex
