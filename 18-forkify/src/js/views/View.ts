// @ts-ignore
import icons from "../../img/icons.svg";

export abstract class View<T, U extends HTMLElement = HTMLElement> {
  protected _parentElement: U = null;
  protected _errorMessage = "";
  protected _message = "";
  protected _data: T = null;

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Render the received object to the DOM
   * @param data The data to be rendered (e.g. recipe)
   * @param render If false, create markup string instead of rendering to the DOM
   * @returns A markup string is returned if render=false
   */
  render(data: T, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this.renderError();
      return "";
    }

    this._data = data;
    const markup = this._generateMarkup();
    if (render) {
      this._clear();
      this._parentElement.insertAdjacentHTML("afterbegin", markup);
      return "";
    } else {
      return markup;
    }
  }

  update(data: T) {
    // if (!data || (Array.isArray(data) && data.length === 0)) {
    //   this.renderError();
    //   return;
    // }

    this._data = data;
    const newMarkup = this._generateMarkup();

    // virtual dom
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll("*"));
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // updte changed text
      if (!curEl.isEqualNode(newEl) && newEl.firstChild?.nodeValue.trim() !== "") {
        curEl.textContent = newEl.textContent;
      }

      // update attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
    // this._clear();
    // this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(msg = this._errorMessage) {
    const markup = `
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

  protected _clear() {
    console.log("clear content");
    this._parentElement.innerHTML = "";
  }

  protected _generateMarkup() {
    return "";
  }
}
