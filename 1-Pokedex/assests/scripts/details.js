import {pokeapi} from "./pokeApi.js";
import {elementFactory} from "./elementFactory.js";

const detailsContainer = document.querySelector(".details-container");

window.addEventListener('load', loadPokemonDetails);

async function loadPokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonRef = urlParams.get("id");
    const data = await pokeapi.getPokemon(pokemonRef);
    // const pokemonDetails = document.createElement("div");
    detailsContainer.innerHTML = await PokemonDetails(data);

    // detailsContainer.appendChild(pokemonDetails);

    const colors = elementFactory.GetElementColors(data.types[0].type.name);
    detailsContainer.querySelectorAll(".progress-bar").forEach((element) => {
        element.style.backgroundColor = `var(${colors[0]})`;
    });

    detailsContainer.querySelectorAll(".nav-link").forEach((element) => {
        element.style.color = `var(${colors[1]})`;
    });

    detailsContainer.querySelectorAll(".pokemon-type").forEach((element) => {
        let _typeColor = elementFactory.GetElementColors(element.textContent);
        element.style.backgroundColor = `var(${_typeColor[0]})`;
        element.style.color = `var(${_typeColor[2]})`;
    });
}

function DetailsHeader() {
    return `
    <div class="hero-container w-100 pt-2 pb-4">
        <button class="back-button rounded-5 border-0">
            <a href="../../index.html" class="w-100 h-100">
                <i class="bi bi-arrow-left fw-bold text-black w-100 h-100"></i>
            </a>
        </button>
    </div>
    `;
}

function DetailsTabs(pokemonData) {
    const tabs = ["About", "Base Stats", "Evolution", "Moves"];
    return tabs.map(element => {
        return `
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="${element.toLowerCase()}-tab" data-bs-toggle="tab"
                        data-bs-target="#${element.toLowerCase()}-${pokemonData.name}" type="button" role="tab" 
                        aria-controls="${element.toLowerCase()}-${pokemonData.name}" aria-selected="true">                        
                    ${element}
                </button>
            </li>
        `;
    }).join("");
}

function PokemonDescription(pokemonData) {
    const pokemonTypes = pokemonData.types
        .map((element) => {
            return `<span class="pokemon-type px-2 py-1 m-1 rounded-4 text-center fw-bold">${element.type.name}</span>`;
        })
        .join("");

    return ` 
        <div class="w-100 d-flex flex-column align-items-center">
            <div class="w-100 d-flex justify-content-between mt-2">
                <h5 class="pokemon-name text-capitalize fw-bold fs-1">${pokemonData.name}</h5>
                <span class="pokemon-number fs-3 fw-medium opacity-50">#${pokemonData.id}</span>
            </div>
            <div class="w-100 pokemon-types">
                    ${pokemonTypes}
            </div>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
        pokemonData.id}.svg" alt="Ilustração ${pokemonData.name}" class="pokemon-image img-fluid p-1 my-2 mx-auto">
       </div>
    `;
}

function PokemonAbout(pokemonData) {
    const pokemonAbilities = pokemonData.abilities
        .map((element) => {
            return " " + element.ability.name;
        })
        .join(",");

    return `
    <div class="tab-pane fade show active" id="about-${pokemonData.name}" 
        role="tabpanel" aria-labelledby="about-tab">
        <p><strong>Height:</strong> ${pokemonData.height / 10} m</p>
        <p><strong>Weight:</strong> ${pokemonData.weight / 10} kg</p>
        <p><strong>Abilities:</strong> ${pokemonAbilities}</p>
    </div>
    `;
}

function PokemonStats(pokemonData) {
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

    return `
        <div class="tab-pane fade" id="stats-${pokemonData.name}" 
        role="tabpanel" aria-labelledby="stats-tab">
            <p><strong>Base Stats:</strong></p>
            <div class="container-fluid">
                ${pokemonStats}
            </div>
        </div>
    `;
}


async function PokemonEvolutions(pokemonData) {
    const speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}/`;
    const speciesData = await (await fetch(speciesURL)).json();

    const evoChainURL = speciesData.evolution_chain.url;
    const evoChainData = await (await fetch(evoChainURL)).json();

    const pokemons = [];

    // Função recursiva para explorar a cadeia de evolução
    function exploreEvolution(chain) {
        // Adiciona o Pokémon atual à lista de evoluções
        pokemons.push({
            name: chain.species.name,
            min_level: chain.evolution_details.length > 0 ? chain.evolution_details[0].min_level : 1,
            url: chain.species.url
        });

        // Se houver evoluções subsequentes, chama a função recursivamente
        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach(evolution => {
                exploreEvolution(evolution);
            });
        }
    }

    // Inicia a exploração a partir do nível mais alto da cadeia de evolução
    exploreEvolution(evoChainData.chain);

    // Monta o HTML dinamicamente com base nas evoluções coletadas
    let evolutionHTML = '';
    for (let i = 0; i < pokemons.length; i++) {
        if (i > 0) {
            evolutionHTML += `
                <div class="col text-center">                   
                    <i class="bi bi-arrow-down"></i>
                     <p class="fw-bold">Lvl ${pokemons[i].min_level}</p>
                     <i class="bi bi-arrow-down"></i>
                </div>`;
        }

        const pokemonID = await (await fetch(pokemons[i].url)).json();

        evolutionHTML += `
            <div class="col text-center">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
            pokemonID.id}.svg" 
                    alt="${pokemons[i].name}"
                    class="evolution-image img-fluid bg-transparent">
                <p class="pokemon-name my-1">${pokemons[i].name}</p>
            </div>`;
    }

    return `
        <div class="tab-pane fade" id="evolution-${pokemonData.name}" 
            role="tabpanel" aria-labelledby="evolution-tab">
            <div class="evolution-chain">
                <div class="row d-flex flex-column align-items-center mb-4">
                    ${evolutionHTML}
                </div>
            </div>
        </div>
    `;
}


function PokemonMoves(pokemonData) {
    const pokemonMoves = pokemonData.moves
        .filter(move => move.version_group_details[0].level_learned_at !== 0)
        .sort((a, b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at)
        .map((element) => {
            return `
      <tr>
        <td>${element.move.name}</td>
        <td class="text-center">
          ${element.version_group_details[0].level_learned_at}
        </td>
      </tr>
    `;
        })
        .join("");

    return `
   <div class="tab-pane fade" id="moves-${pokemonData.name}" role="tabpanel" aria-labelledby="moves-tab">
        <div class="moves-table-container w-100 h-auto">
            <table class="table table-striped moves-table">
                <thead>
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
    
    `;
}

async function PokemonDetails(pokemonData) {
    return `
    ${DetailsHeader()}
    ${PokemonDescription(pokemonData)}
    <div class="tabs-container row w-100">
            <!-- Tabs -->
            <ul class="nav nav-tabs mt-3 d-flex flex-row align-items-center justify-content-start" id="${
        pokemonData.name}-Tab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="about-tab" data-bs-toggle="tab"
                            data-bs-target="#about-${pokemonData.name}" type="button" role="tab" 
                            aria-controls="about-${pokemonData.name}" aria-selected="true">                        
                        About
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="stats-tab" data-bs-toggle="tab" 
                        data-bs-target="#stats-${pokemonData.name}" type="button" role="tab" 
                        aria-controls="stats-${pokemonData.name}" aria-selected="false">                    
                    Base Stats
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="evolution-tab" data-bs-toggle="tab"
                        data-bs-target="#evolution-${pokemonData.name}" type="button" role="tab"
                        aria-controls="evolution-${pokemonData.name}" 
                        aria-selected="false">                        
                    Evolution
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="moves-tab" data-bs-toggle="tab" 
                        data-bs-target="#moves-${pokemonData.name}" type="button" role="tab" 
                        aria-controls="moves-${pokemonData.name}" aria-selected="false">                    
                    Moves
                    </button>
                </li>
            </ul>
            <!-- Tab Content -->
            <div class="tab-content mt-3" id="${pokemonData.name}TabContent">                
                <!-- About/Summary go here -->
                ${PokemonAbout(pokemonData)}
                
                <!-- Base Stats go here -->
                ${PokemonStats(pokemonData)}
                
                <!-- Evolution data go here -->
                ${await PokemonEvolutions(pokemonData)}
                
                <!-- Moves -->
                ${PokemonMoves(pokemonData)}
            </div>
        </div>`;
}
