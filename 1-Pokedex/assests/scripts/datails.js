import { pokeapi } from "./pokeApi.js";
import { elementFactory } from "./elementFactory.js";

const detailsContainer = document.querySelector(".details-container");

async function loadPokemonDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonRef = urlParams.get("id");
  const data = await pokeapi.getPokemon(pokemonRef);
  const pokemonDetails = document.createElement("div");
  pokemonDetails.innerHTML = await PokemonDetails(data);

  detailsContainer.appendChild(pokemonDetails);

  const colors = elementFactory.GetElementColors(data.types[0].type.name);
  pokemonDetails.querySelectorAll(".progress-bar").forEach((element) => {
    element.style.backgroundColor = `var(${colors[0]})`;
  });

  pokemonDetails.querySelectorAll("nav-link").forEach((element) => {
    element.style.color = `var(${colors[0]})`;
  });

  pokemonDetails.querySelectorAll(".pokemon-type").forEach((element) => {
    let _typeColor = elementFactory.GetElementColors(element.textContent);
    element.style.backgroundColor = `var(${_typeColor[0]})`;
    element.style.color = `var(${_typeColor[2]})`;
  });
}

loadPokemonDetails();

async function PokemonDetails(pokemonData) {
  // Pokemon Types
  const pokemonTypes = pokemonData.types
    .map((element) => {
      return `<span class="pokemon-type px-2 py-1 m-1 rounded-4 text-center fw-bold">${element.type.name}</span>`;
    })
    .join("");

  // Pokemon Stats
  const pokemonStats = pokemonData.stats
    .map((element) => {
      return `       <div class="row row-cols-12 w-100 d-flex align-items-center">
                            <div class="col-6">${element.stat.name}</div>
                            <div class="col-2 fw-bold">${
                              element.base_stat
                            }</div>
                            <div class="col-4">
                                <div class="progress w-100 ms-2">
                                    <div class="progress-bar bg-blue" role="progressbar" style="width: ${
                                      (element.base_stat / 154) * 100
                                    }%"
                                        aria-valuenow="${
                                          element.base_stat
                                        }" aria-valuemin="0" aria-valuemax="154"></div>
                                </div>
                            </div>
                        </div>`;
    })
    .join("");

  // Pokemon Abilities
  const pokemonAbilities = pokemonData.abilities
    .map((element) => {
      return " " + element.ability.name;
    })
    .join(",");

  // Pokemon About
  const pokemonAbout = await fetch(
    `https://pokeapi.co/api/v2/evolution-chain/${pokemonData.id}`
  );
  const pokemonAboutData = await pokemonAbout.json();
  console.log(pokemonAboutData);

  // Pokemon Evolutions
  const pokemonEvolotuions = await fetch(
    `https://pokeapi.co/api/v2/evolution-chain/${pokemonData.id}`
  );
  const pokemonEvolotuionsData = await pokemonEvolotuions.json();

  console.log(pokemonEvolotuionsData);

  // Pokemon Moves
  const pokemonMoves =
    pokemonData.moves.length > 0
      ? [...pokemonData.moves]
          .sort((a, b) => a.move.name.localeCompare(b.move.name))
          .map((element) => {
            return `
        <tr>
          <td>${element.move.name}</td>
          <td class="text-center">${
            element.version_group_details[0].level_learned_at
              ? element.version_group_details[0].level_learned_at
              : 0
          }</td>
        </tr>
      `;
          })
          .join("")
      : '<tr><td colspan="2">No moves found</td></tr>';

  console.log(pokemonMoves);
  // Pokemon Details
  return `<div class="hero-container w-100 pt-2 pb-4">
            <button class="back-button rounded-5 border-0">
                <a href="../../index.html" class="w-100 h-100">
                    <i class="bi bi-arrow-left fw-bold text-black w-100 h-100"></i>
                </a>
            </button>
        </div>
        <div class="hero-container row row-gap-2">
            <div class="w-100 d-flex justify-content-between mt-2">
                <h5 class="pokemon-name text-capitalize fw-bold fs-1">${
                  pokemonData.name
                }
                </h5>
                <span class="pokemon-number fs-3 fw-medium opacity-50">#${
                  pokemonData.id
                }</span>
            </div>
            <div class="w-100 pokemon-types">
                ${pokemonTypes}
            </div>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
              pokemonData.id
            }.svg"
                alt="Ilustração ${
                  pokemonData.name
                }" class="pokemon-image img-fluid p-1 my-2 mx-auto">
        </div>
        <div class="tabs-container row w-100">
            <!-- Tabs -->
            <ul class="nav nav-tabs mt-3 d-flex flex-row align-items-center justify-content-between" id="${
              pokemonData.name
            }-Tab"
                role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="about-tab" data-bs-toggle="tab"
                        data-bs-target="#about-${
                          pokemonData.name
                        }" type="button" role="tab" aria-controls="about-${
    pokemonData.name
  }"
                        aria-selected="true">About</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats-${
                      pokemonData.name
                    }"
                        type="button" role="tab" aria-controls="stats-${
                          pokemonData.name
                        }" aria-selected="false">Base
                        Stats</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="evolution-tab" data-bs-toggle="tab"
                        data-bs-target="#evolution-${
                          pokemonData.name
                        }" type="button" role="tab"
                        aria-controls="evolution-${
                          pokemonData.name
                        }" aria-selected="false">Evolution</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="moves-tab" data-bs-toggle="tab" data-bs-target="#moves-${
                      pokemonData.name
                    }"
                        type="button" role="tab" aria-controls="moves-${
                          pokemonData.name
                        }" aria-selected="false">Moves</button>
                </li>
            </ul>
            <!-- Tab Content -->
            <div class="tab-content mt-3" id="${pokemonData.name}TabContent">
                
            <!-- About/Summary go here -->
                <div class="tab-pane fade show active" id="about-${
                  pokemonData.name
                }" role="tabpanel" aria-labelledby="about-tab">
                    <p><strong>Height:</strong> ${pokemonData.height / 10} m</p>
                    <p><strong>Weight:</strong> ${
                      pokemonData.weight / 10
                    } kg</p>
                    <p><strong>Abilities:</strong> ${pokemonAbilities}</p>
                </div>
                
                <!-- Base Stats go here -->
                <div class="tab-pane fade" id="stats-${
                  pokemonData.name
                }" role="tabpanel" aria-labelledby="stats-tab">
                    <p><strong>Base Stats:</strong></p>
                    <div class="container-fluid">
                        ${pokemonStats}
                    </div>

                </div>
                
                <!-- Evolution data go here -->
                <div class="tab-pane fade" id="evolution-${
                  pokemonData.name
                }" role="tabpanel" aria-labelledby="evolution-tab">

                    <div class="evolution-chain">
                        <div class="row align-items-center mb-4">
                            <div class="col text-center">
                                <img src="path-to-${
                                  pokemonData.name
                                }-image.png" alt="${pokemonData.name}"
                                    class="evolution-image img-fluid">
                                <p>${pokemonData.name}</p>
                            </div>
                            <div class="col text-center">
                                <p>Lvl 16</p>
                                <i class="bi bi-arrow-right"></i>
                            </div>
                            <div class="col text-center">
                                <img src="path-to-ivysaur-image.png" alt="Ivysaur" class="evolution-image img-fluid">
                                <p>Ivysaur</p>
                            </div>
                        </div>
                        <div class="row align-items-center">
                            <div class="col text-center">
                                <img src="path-to-ivysaur-image.png" alt="Ivysaur" class="evolution-image img-fluid">
                                <p>Ivysaur</p>
                            </div>
                            <div class="col text-center">
                                <p>Lvl 34</p>
                                <i class="bi bi-arrow-right"></i>
                            </div>
                            <div class="col text-center">
                                <img src="path-to-venusaur-image.png" alt="Venusaur" class="evolution-image img-fluid">
                                <p>Venusaur</p>
                            </div>
                        </div>
                    </div>

                </div>
                
                <!-- Moves -->
                <div class="tab-pane fade" id="moves-bulbasaur" role="tabpanel" aria-labelledby="moves-tab">
                    <div class="moves-table-container w-100 h-auto">
                        <table class="table table-striped moves-table">
                            <thead class="">
                                <tr>
                                    <th>Name</th>
                                    <th class="text-center">Lvl</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pokemonMoves}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
}
