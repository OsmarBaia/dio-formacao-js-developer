const pokemonsList = document.querySelector(".pokemons");

let isSpinnerVisible = false;

function CreateSpinner() {
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  const dot1 = document.createElement("div");
  dot1.classList.add("spinner-dot");
  spinner.appendChild(dot1);

  const dot2 = document.createElement("div");
  dot2.classList.add("spinner-dot");
  spinner.appendChild(dot2);

  const dot3 = document.createElement("div");
  dot3.classList.add("spinner-dot");
  spinner.appendChild(dot3);

  isSpinnerVisible = true;
  return spinner;
}

function RemoveSpinner() {
  const spinner = document.querySelector(".spinner");
  if (!spinner) return;
  spinner.remove();
  isSpinnerVisible = false;
}

// Inicialiação
let offset = 0;
let limit = 30;
const pokemonMaxCount = 151;

function init() {
  pokemonsList.appendChild(CreateSpinner());
  fetchPokemonsInRange(offset, limit);
}

async function fetchPokemons(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchPokemonsInRange(offset, limit) {
  try {
    // Append Spinner final da lista
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const data = await fetchPokemons(url);
    const results = data.results;

    for (const result of results) {
      const pokemonData = await fetchPokemons(result.url);
      inserirPokemon(pokemonData);
    }

    RemoveSpinner();
  } catch (error) {
    alert("Erro ao carregar os pokemons\n\nA pagina sera recarregada");
    document.location.reload();
  } finally {
    RemoveSpinner();
  }
}

function inserirPokemon(pokemonData) {
  const _data = pokemonData;
  const pokemonElement = CreatePokemonCotainerElement(_data);
  const pokemonLink = CreatePokemonDetailsLinkElement(_data);
  const pokemonNumber = CreatePokemonNumberElement(_data);
  const pokemonName = CreatePokemonNameElement(_data);
  const pokemonDetails = CreatePokemonTypesElement(_data);
  const pokemonImage = CreatePokemonFigureElement(_data);

  pokemonLink.appendChild(pokemonNumber);
  pokemonLink.appendChild(pokemonName);
  pokemonLink.appendChild(pokemonDetails);
  pokemonLink.appendChild(pokemonImage);
  pokemonElement.appendChild(pokemonLink);

  // Encontre o elemento <ol> com a classe "pokemons" e adicione o elemento <li> criado como filho
  const pokemonsList = document.querySelector(".pokemons");
  pokemonsList.appendChild(pokemonElement);
}

init();
// FIM da Inicialiação

// Criacao e Estilização dos elementos

function GetElementColors(typeName) {
  const typePrefix = `--pokemon-${typeName}`;
  const colors = [
    `${typePrefix}-bg-color`,
    `${typePrefix}-btn-color`,
    `${typePrefix}-text-color`,
  ];

  return colors;
}

function SetPokemonTextElementStyle(pokemonData, element) {
  const pokemonMainType = pokemonData.types[0].type.name;
  const colors = GetElementColors(pokemonMainType);
  element.style.backgroundColor = `var(${colors[0]})`;
  element.style.color = `var(${colors[2]})`;
}

function CreatePokemonCotainerElement(pokemonData) {
  const pokemonElement = document.createElement("li");
  pokemonElement.classList.add("pokemon-card");
  pokemonElement.setAttribute("role", "menuitem");
  pokemonElement.setAttribute("aria-label", `${pokemonData.name}`);

  const colors = GetElementColors(pokemonData.types[0].type.name);
  pokemonElement.style.backgroundColor = `var(${colors[0]})`;

  return pokemonElement;
}

function CreatePokemonTypesElement(pokemonData) {
  const pokemonDetails = document.createElement("div");
  pokemonDetails.classList.add("pokemon-details");

  SetPokemonTextElementStyle(pokemonData, pokemonDetails);

  pokemonData.types.forEach((type) => {
    const pokemonType = document.createElement("div");
    pokemonType.textContent = type.type.name;
    const colors = GetElementColors(type.type.name);
    pokemonType.style.backgroundColor = `var(${colors[1]})`;
    pokemonType.style.color = `var(${colors[2]})`;
    pokemonDetails.appendChild(pokemonType);
  });

  return pokemonDetails;
}

function CreatePokemonDetailsLinkElement(pokemonData) {
  const pokemonLink = document.createElement("a");
  pokemonLink.href = "#";
  pokemonLink.classList.add("pokemon");
  pokemonLink.setAttribute("role", "button");
  pokemonLink.setAttribute("aria-label", `Ver Detalhes de ${pokemonData.name}`);

  SetPokemonTextElementStyle(pokemonData, pokemonLink);

  return pokemonLink;
}

function CreatePokemonFigureElement(pokemonData) {
  const pokemonImage = document.createElement("figure");
  pokemonImage.classList.add("pokemon-image");

  SetPokemonTextElementStyle(pokemonData, pokemonImage);

  const pokemonImageFigure = document.createElement("img");
  pokemonImageFigure.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonData.id}.svg`;
  pokemonImageFigure.alt = "Ilustração do Bulbasauro";

  SetPokemonTextElementStyle(pokemonData, pokemonImageFigure);

  pokemonImage.appendChild(pokemonImageFigure);
  return pokemonImage;
}

function CreatePokemonNameElement(pokemonData) {
  const pokemonName = document.createElement("h2");
  pokemonName.classList.add("pokemon-name");
  pokemonName.textContent = `${pokemonData.name}`;

  SetPokemonTextElementStyle(pokemonData, pokemonName);

  return pokemonName;
}

function CreatePokemonNumberElement(pokemonData) {
  const pokemonNumber = document.createElement("p");
  pokemonNumber.classList.add("pokemon-number");
  pokemonNumber.textContent = `#${pokemonData.id}`;

  SetPokemonTextElementStyle(pokemonData, pokemonNumber);

  return pokemonNumber;
}

// FIM Criacao e Estilização dos elementos

// Filtros de Busca

// FIM Filtros de Busca

// Rolagem da Pokedex (busca esta vindo desordenada)

window.addEventListener("scroll", function (event) {
  const alturaJanela = window.innerHeight;
  const rect = pokemonsList.getBoundingClientRect();
  if (isSpinnerVisible) {
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
