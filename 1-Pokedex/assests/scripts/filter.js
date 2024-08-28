export { isFiltering };
import { elementFactory } from "./elementFactory.js";
import { pokeapi } from "./pokeApi.js";
import { spinner } from "./spinner.js";

const filterButton = document.querySelector("#filter-button");
const filterMenu = document.querySelector("#filter-menu");
const filterType = document.querySelectorAll(".filter-type");
const pokemonsList = document.querySelector(".pokemons");

const maxFilterStacks = 2;
let filterStacks = [];

let isFiltering = false;

filterButton.addEventListener("click", () => {
  const filterBtnIcon = filterButton.querySelector("i");
  if (filterMenu.classList.contains("hidden")) {
    filterButton.classList.add("active");
    filterMenu.classList.remove("hidden");
    // Icone do botão
    filterBtnIcon.classList.add("bi-x-lg");
    filterBtnIcon.classList.remove("bi-filter");
  } else {
    filterMenu.classList.add("hidden");
    filterButton.classList.remove("active");
    // Icone do botão
    filterBtnIcon.classList.add("bi-filter");
    filterBtnIcon.classList.remove("bi-x-lg");
  }
});

async function getRemainingPokemons() {
  const pokemonsList = document.querySelector(".pokemons");
  const pokemonsOnPage = pokemonsList.querySelectorAll(".pokemon-card");
  //
  const remaningPokemons = await pokeapi.getPokemonsInRange(
    pokemonsOnPage.length,
    pokeapi.pokemonMaxCount - pokemonsOnPage.length
  );
  const results = remaningPokemons.results;
  //
  const pokemons = await Promise.all(
    results.map(async (result) => {
      const pokemon = await pokeapi.getPokemon(result.name);
      return elementFactory.CreatePokemonCard(pokemon);
    })
  );
  pokemonsList.append(...pokemons);
}

function togglePokemonVisibilityByType(type) {
  const pokemonsList = document.querySelector(".pokemons");
  const allPokemons = pokemonsList.querySelectorAll(".pokemon-card");
  allPokemons.forEach((pokemon) => {
    const pokemonTypes = pokemon.querySelectorAll(".pokemon-type");
    let hasType = false;
    pokemonTypes.forEach((pokemonType) => {
      if (pokemonType.textContent.toLowerCase() === type) {
        hasType = true;
      }
    });
    if (hasType) {
      if (filterStacks.length === 1 && pokemon.classList.contains("hidden")) {
        pokemon.style.display = "block";
      } else {
        if (!pokemon.classList.contains("hidden")) {
          pokemon.style.display = "block";
        }
      }
    } else {
      pokemon.style.display = "none";
      pokemon.classList.add("hidden");
    }
  });
}

async function addFilter(type) {
  if (filterStacks.length < maxFilterStacks) {
    filterStacks.push(type);
    isFiltering = true;
    spinner.ToggleSpinnerAt(pokemonsList);
    if (filterStacks.length === 1) {
      await getRemainingPokemons();
      togglePokemonVisibilityByType(type);
    } else {
      togglePokemonVisibilityByType(type);
    }
    spinner.ToggleSpinnerAt(pokemonsList);
  }
}

function removeFilter(type) {
  console.log("Called for: ", type);
  const index = filterStacks.indexOf(type);
  if (index !== -1) {
    filterStacks.splice(index, 1);
  }
  if (filterStacks.length === 1) {
    addFilter(filterStacks.pop().toLowerCase());
  } else {
    document.location.reload();
    isFiltering = false;
  }
}

function toggleButtonClickable() {
  const filteTypeBtns = document.querySelectorAll(".filter-type");
  if (filterStacks.length < maxFilterStacks) {
    filteTypeBtns.forEach((btn) => {
      btn.disabled = false;
    });
  } else {
    filteTypeBtns.forEach((btn) => {
      if (!btn.classList.contains("active")) {
        btn.disabled = true;
      }
    });
  }
}

function toggleFilter(type) {
  if (filterStacks.includes(type)) {
    removeFilter(type);
  } else {
    addFilter(type);
  }
  toggleButtonClickable();
}

function init() {
  filterType.forEach((button) => {
    const type = button.textContent.toLowerCase();
    const colors = elementFactory.GetElementColors(type);

    button.style.backgroundColor = `var(${colors[1]})`;
    button.style.color = `var(${colors[2]})`;

    button.addEventListener("click", (event) => {
      event.preventDefault();
      button.classList.toggle("active");
      toggleFilter(button.textContent.toLowerCase());
    });
  });
}

init();
