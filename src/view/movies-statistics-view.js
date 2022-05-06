import {createElement} from '../render.js';

const createMoviesStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class MoviesStaticticsView {
  #element = null;
  get template() {
    return createMoviesStatisticsTemplate();
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
