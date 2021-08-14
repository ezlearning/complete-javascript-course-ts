import { Recipe } from "../types";
import { View } from "./View";
import { previewView } from "./PreviewView";

class ResultsView extends View<Recipe[]> {
  constructor() {
    super();
    this._parentElement = document.querySelector<HTMLElement>(".results");
    this._errorMessage = "No recipes found for your query! Please try again ;)";
  }

  protected _generateMarkup() {
    return this._data.map((result) => previewView.render(result, false)).join("");
  }
}

export const resultsView = new ResultsView();
