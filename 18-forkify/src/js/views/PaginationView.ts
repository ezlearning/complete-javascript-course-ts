import { View } from "./View";

// @ts-ignore
import icons from "../../img/icons.svg";
import { SearchResult } from "../model";

class PaginationView extends View<SearchResult> {
  constructor() {
    super();
    this._parentElement = document.querySelector(".pagination");
  }

  addController(controller: (number: number) => void) {
    this._parentElement.addEventListener("click", (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const btn = event.target.closest<HTMLButtonElement>(".btn--inline");
      if (!(btn && btn.dataset.page)) return;

      controller(Number(btn.dataset.page));
    });
  }

  private _generateNextPageMarkup(nextPage: number) {
    return `
      <button class="btn--inline pagination__btn--next" data-page="${nextPage}">
        <span>Page ${nextPage}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>`;
  }

  private _generatePrevPageMarkup(prevPage: number) {
    return `
      <button class="btn--inline pagination__btn--prev" data-page="${prevPage}">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${prevPage}</span>
      </button>`;
  }

  protected _generateMarkup() {
    const { results, page, itemsPerPage } = this._data;
    const numPages = Math.ceil(results.length / itemsPerPage);

    // page 1. and there are other pages
    if (page === 1 && numPages > 1) {
      return this._generateNextPageMarkup(page + 1);
    }

    // last page
    if (page === numPages && page > 1) {
      return this._generatePrevPageMarkup(page - 1);
    }

    // Other page
    if (page < numPages) {
      return (
        this._generatePrevPageMarkup(page - 1) + this._generateNextPageMarkup(page + 1)
      );
    }

    // only 1 page
    return "";
  }
}

export const paginationView = new PaginationView();
