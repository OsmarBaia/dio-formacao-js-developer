import { elementFactory } from "./elementFactory.js";

export class spinner {
  static isSpinnerVisible = false;

  static ToggleSpinnerAt(element) {
    const spinner = document.querySelector(".spinner");
    // const pokemonsList = document.querySelector(".pokemons");

    if (!spinner) {
      element.appendChild(elementFactory.CreateSpinner());
      this.isSpinnerVisible = true;
    } else {
      spinner.remove();
      this.isSpinnerVisible = false;
    }
  }
}
