import {createElement} from '../render.js';

const createMoviesViewTemplate = () => '<section class="films"></section>';

export default class MoviesView {
  #element = null;
  get template() {
    return createMoviesViewTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
