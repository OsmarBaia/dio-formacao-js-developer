import { pokeapi } from "./pokeApi.js";
import { spinner } from "./spinner.js";

const form = document.getElementById("search-form");
const searchBar = document.getElementById("search-bar");
const searchIcon = document.getElementById("search-icon");
const pokemonsList = document.querySelector(".pokemons");

const pokemonMaxCount = 151;

const submitEvent = new Event("submit", { bubbles: true });

document.getElementById("search-button").addEventListener("click", function () {
  if (searchBar.classList.contains("expanded")) {
    searchBar.classList.remove("expanded");
    searchIcon.classList.remove("bi-x-lg");
    searchIcon.classList.add("bi-search");
    searchBar.value = "";
    form.dispatchEvent(submitEvent);
  } else {
    searchBar.classList.add("expanded");
    searchIcon.classList.remove("bi-search");
    searchIcon.classList.add("bi-x-lg");
  }
});

function searchPokemonOnCards(pokemonRef) {
  spinner.ToggleSpinnerAt(pokemonsList);
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

  spinner.ToggleSpinnerAt(pokemonsList);
  return wasFound;
}

async function searchPokemonOnAPI(pokemonRef) {
  spinner.ToggleSpinnerAt(pokemonsList);
  const pokemonCard = await pokeapi.getOnePokemonCard(pokemonRef);
  if (pokemonCard) {
    pokemonsList.appendChild(pokemonCard);
  } else {
    await pokeapi.fetchAndInsertPokemons(0, pokemonMaxCount);
    if (!searchPokemonOnCards(pokemonRef)) {
      alert("Pokemon não encontrado");
    }
  }
  spinner.ToggleSpinnerAt(pokemonsList);
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const pokemonRef = searchBar.value;
  if (!searchPokemonOnCards(pokemonRef)) {
    searchPokemonOnAPI(pokemonRef);
  }
});
