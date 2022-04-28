import {createElement} from '../render.js';

const createMoviesExtraTemplate = (heading) => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">${heading}</h2>
  </section>`
);

export default class MoviesExtraView {
  constructor(heading) {
    this.heading = heading;
  }

  getTemplate() {
    return createMoviesExtraTemplate(this.heading);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
