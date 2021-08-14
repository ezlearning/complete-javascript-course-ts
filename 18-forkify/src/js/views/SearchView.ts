class SearchView {
  _form = document.querySelector<HTMLFormElement>(".search");

  addController(controller: () => void) {
    this._form.addEventListener("submit", (event) => {
      event.preventDefault();
      controller();
    });
  }

  getQuery() {
    const inputEl = this._form.querySelector<HTMLInputElement>(".search__field");
    return inputEl.value;
  }

  clear() {
    const inputEl = this._form.querySelector<HTMLInputElement>(".search__field");
    return inputEl.value;
  }
}

export const searchView = new SearchView();
