import { Recipe, RecipeForm } from "../types";
import { View } from "./View";
import icons from "../../img/icons.svg";

class AddRecipeView extends View<Recipe, HTMLDivElement> {
  _window = document.querySelector<HTMLDivElement>(".add-recipe-window");
  _overlay = document.querySelector<HTMLDivElement>(".overlay");
  _btnOpen = document.querySelector<HTMLButtonElement>(".nav__btn--add-recipe");

  constructor() {
    super();
    console.log("AddRecipeView construct");
    this._parentElement = document.querySelector<HTMLDivElement>(".add-recipe-window");
    this._message = "Recipe was successfully uploaded :)";
    this._errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it ;)";
    this.init();
  }

  init() {
    this._addShowWindowHandler();
    this._addHideWindowHandler();
  }

  toggleWindow() {
    this._overlay.classList.toggle("hidden");
    this._window.classList.toggle("hidden");
  }

  renderRecipeForm() {
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  _addShowWindowHandler() {
    this._btnOpen.addEventListener("click", (_) => {
      this.renderRecipeForm();
      this.toggleWindow();
    });
  }

  _addHideWindowHandler() {
    this._parentElement.addEventListener("click", (event) => {
      const target = event.target;
      if (
        target instanceof HTMLButtonElement &&
        target.classList.contains("btn--close-modal")
      ) {
        this.toggleWindow();
      }
    });
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addUploadHandler(handler: (recipe: RecipeForm) => void) {
    this._parentElement.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element) {
        const btn = target.closest<HTMLButtonElement>(".upload__btn");
        if (!btn) return;

        console.log("is upload button");
        event.preventDefault();
        const formEl = this._parentElement.querySelector<HTMLFormElement>("form");
        const dataArr = [...new FormData(formEl)];
        const data = Object.fromEntries(dataArr);
        handler(data);
      }
    });
  }

  protected _generateMarkup() {
    return `
      <button class="btn--close-modal">&times;</button>
      <form class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST123" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST123" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST123" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST123" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      </form>
      `;
  }

  renderError(msg = this._errorMessage) {
    const markup = `
      <button class="btn--close-modal">&times;</button>
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${msg}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <button class="btn--close-modal">&times;</button>
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}

export const addRecipeView = new AddRecipeView();
