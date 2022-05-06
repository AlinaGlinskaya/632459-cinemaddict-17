import {createElement} from '../render.js';

const createMoviesExtraTemplate = (heading) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${heading}</h2>
  </section>`
);

export default class MoviesExtraView {
  #heading;
  #element = null;
  constructor(heading) {
    this.#heading = heading;
  }

  get template() {
    return createMoviesExtraTemplate(this.#heading);
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
