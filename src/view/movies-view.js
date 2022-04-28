import {createElement} from '../render.js';

const createMoviesViewTemplate = () => '<section class="films"></section>';

export default class MoviesView {
  getTemplate() {
    return createMoviesViewTemplate;
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
