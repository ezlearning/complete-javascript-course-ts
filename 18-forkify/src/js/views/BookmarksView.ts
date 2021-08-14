import { Recipe } from "../types";
import { View } from "./View";
import { previewView } from "./PreviewView";

class BookmarksView extends View<Recipe[]> {
  constructor() {
    super();
    this._parentElement = document.querySelector<HTMLElement>(".bookmarks__list");
    this._errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it ;)";
  }

  addController(controller: () => void) {
    window.addEventListener("load", controller);
  }

  protected _generateMarkup() {
    return this._data.map((bookmark) => previewView.render(bookmark, false)).join("");
  }
}

export const bookmarksView = new BookmarksView();
