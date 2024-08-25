export class elementFactory {
  static GetElementColors(typeName) {
    const typePrefix = `--pokemon-${typeName}`;
    const colors = [
      `${typePrefix}-bg-color`,
      `${typePrefix}-btn-color`,
      `${typePrefix}-text-color`,
    ];
    return colors;
  }

  static SetPokemonTextElementStyle(pokemonData, element) {
    const pokemonMainType = pokemonData.types[0].type.name;
    const colors = this.GetElementColors(pokemonMainType);
    element.style.backgroundColor = `var(${colors[0]})`;
    element.style.color = `var(${colors[2]})`;
  }

  static CreatePokemonCotainerElement(pokemonData) {
    const pokemonElement = document.createElement("li");
    pokemonElement.classList.add("pokemon-card");
    pokemonElement.setAttribute("role", "menuitem");
    pokemonElement.setAttribute("aria-label", `${pokemonData.name}`);

    const colors = this.GetElementColors(pokemonData.types[0].type.name);
    pokemonElement.style.backgroundColor = `var(${colors[0]})`;

    return pokemonElement;
  }

  static CreatePokemonTypesElement(pokemonData) {
    const pokemonDetails = document.createElement("div");
    pokemonDetails.classList.add("pokemon-details");

    this.SetPokemonTextElementStyle(pokemonData, pokemonDetails);

    pokemonData.types.forEach((type) => {
      const pokemonType = document.createElement("div");
      pokemonType.textContent = type.type.name;
      const colors = this.GetElementColors(type.type.name);
      pokemonType.style.backgroundColor = `var(${colors[1]})`;
      pokemonType.style.color = `var(${colors[2]})`;
      pokemonDetails.appendChild(pokemonType);
    });

    return pokemonDetails;
  }

  static CreatePokemonDetailsLinkElement(pokemonData) {
    const pokemonLink = document.createElement("a");
    pokemonLink.href = "#";
    pokemonLink.classList.add("pokemon");
    pokemonLink.setAttribute("role", "button");
    pokemonLink.setAttribute(
      "aria-label",
      `Ver Detalhes de ${pokemonData.name}`
    );

    this.SetPokemonTextElementStyle(pokemonData, pokemonLink);

    return pokemonLink;
  }

  static CreatePokemonFigureElement(pokemonData) {
    const pokemonImage = document.createElement("figure");
    pokemonImage.classList.add("pokemon-image");

    this.SetPokemonTextElementStyle(pokemonData, pokemonImage);

    const pokemonImageFigure = document.createElement("img");
    pokemonImageFigure.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonData.id}.svg`;
    pokemonImageFigure.alt = `Ilustração do ${pokemonData.name}`;

    this.SetPokemonTextElementStyle(pokemonData, pokemonImageFigure);

    pokemonImage.appendChild(pokemonImageFigure);
    return pokemonImage;
  }

  static CreatePokemonNameElement(pokemonData) {
    const pokemonName = document.createElement("h2");
    pokemonName.classList.add("pokemon-name");
    pokemonName.textContent = `${pokemonData.name}`;

    this.SetPokemonTextElementStyle(pokemonData, pokemonName);

    return pokemonName;
  }

  static CreatePokemonNumberElement(pokemonData) {
    const pokemonNumber = document.createElement("p");
    pokemonNumber.classList.add("pokemon-number");
    pokemonNumber.textContent = `#${pokemonData.id}`;

    this.SetPokemonTextElementStyle(pokemonData, pokemonNumber);

    return pokemonNumber;
  }
  static CreatePokemonCard(pokemonData) {
    const _data = pokemonData;
    const pokemonElement = this.CreatePokemonCotainerElement(_data);
    const pokemonLink = this.CreatePokemonDetailsLinkElement(_data);
    const pokemonNumber = this.CreatePokemonNumberElement(_data);
    const pokemonName = this.CreatePokemonNameElement(_data);
    const pokemonDetails = this.CreatePokemonTypesElement(_data);
    const pokemonImage = this.CreatePokemonFigureElement(_data);

    pokemonLink.appendChild(pokemonNumber);
    pokemonLink.appendChild(pokemonName);
    pokemonLink.appendChild(pokemonDetails);
    pokemonLink.appendChild(pokemonImage);
    pokemonElement.appendChild(pokemonLink);
    return pokemonElement;
  }

  // Spinner
  static isSpinnerVisible = false;

  static CreateSpinner() {
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

    this.isSpinnerVisible = true;
    return spinner;
  }

  static RemoveSpinner() {
    const spinner = document.querySelector(".spinner");
    if (!spinner) return;
    spinner.remove();
    this.isSpinnerVisible = false;
  }
}
