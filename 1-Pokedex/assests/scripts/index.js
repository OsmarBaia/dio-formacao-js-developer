import { elementFactory } from "./elementFactory.js";
import { pokeapi } from "./pokeApi.js";

//
const pokemonsList = document.querySelector(".pokemons");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-bar");
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

async function fetchAPokemonCard(pokemonRef) {
  const pokemonData = await pokeapi.getPokemon(pokemonRef);
  const pokemonCard = elementFactory.CreatePokemonCard(pokemonData);
  return pokemonCard;
}

async function fetchAndInsertPokemons(offset, limit) {
  ToggleSpinner();
  const data = await pokeapi.getPokemons(offset, limit);
  const results = data.results;
  for (const result of results) {
    pokemonsList.appendChild(await fetchAPokemonCard(result.name));
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

function searchPokemonOnCards(pokemonRef) {
  ToggleSpinner();
  const onScreenPokemons = document.querySelectorAll(".pokemon-card");
  let wasFound = false;

  onScreenPokemons.forEach((pokemon) => {
    const pokemonName = pokemon.querySelector(".pokemon-name").textContent;
    const pokemonNumber = pokemon.querySelector(".pokemon-number").textContent;

    if (
      pokemonName.toLowerCase().includes(pokemonRef.toLowerCase()) ||
      pokemonNumber.match(`#${pokemonRef}$`)
    ) {
      pokemon.style.display = "block";
      wasFound = true;
    } else {
      pokemon.style.display = "none";
    }
  });

  ToggleSpinner();
  return wasFound;
}

async function searchPokemonOnAPI(pokemonRef) {
  ToggleSpinner();
  const pokemonCard = await fetchAPokemonCard(pokemonRef);
  if (pokemonCard) {
    pokemonsList.appendChild(pokemonCard);
  } else {
    await fetchAndInsertPokemons(0, pokemonMaxCount);
    if (!searchPokemonOnCards(pokemonRef)) {
      alert("Pokemon não encontrado");
    }
  }
  ToggleSpinner();
}

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const pokemonRef = searchInput.value;
  if (!searchPokemonOnCards(pokemonRef)) {
    searchPokemonOnAPI(pokemonRef);
  }
});

async function filterPokemonByType(type) {
  await fetchAndInsertPokemons(0, pokemonMaxCount);
  const onScreenPokemons = document.querySelectorAll(".pokemon-card");
  onScreenPokemons.forEach((pokemon) => {
    const pokemonTypes = pokemon.querySelectorAll(".pokemon-type");
    pokemonTypes.forEach((pokemonType) => {
      if (pokemonType.textContent === type) {
        pokemon.style.display = "block";
        return;
      } else {
        pokemon.style.display = "none";
      }
    });
  });
}

// FIM Filtros de Busca
