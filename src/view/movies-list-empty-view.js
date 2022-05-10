import {createElement} from '../render.js';

const createMoviesListEmptyTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class MoviesListEmptyView {
  #element = null;
  get template() {
    return createMoviesListEmptyTemplate();
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
