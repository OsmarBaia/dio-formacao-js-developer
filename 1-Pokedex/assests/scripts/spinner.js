import { elementFactory } from "./elementFactory.js";

export class spinner {
  static isSpinnerVisible = false;

  static ToggleSpinnerAt() {
    const spinner = document.querySelector(".spinner");
    const pokemonsList = document.querySelector(".pokemons");

    if (!spinner) {
      pokemonsList.appendChild(elementFactory.CreateSpinner());
      this.isSpinnerVisible = true;
    } else {
      spinner.remove();
      this.isSpinnerVisible = false;
    }
  }
}
