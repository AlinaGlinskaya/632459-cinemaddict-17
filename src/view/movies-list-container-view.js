import {createElement} from '../render.js';

const createMoviesListContainerTemplate = () => '<div class="films-list__container"></div';

export default class MoviesListContainerView {
  #element = null;
  get template() {
    return createMoviesListContainerTemplate();
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
