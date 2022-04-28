import {createElement} from '../render.js';

const createMoviesListContainerTemplate = () => '<div class="films-list__container"></div';

export default class MoviesListContainerView {
  getTemplate() {
    return createMoviesListContainerTemplate;
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
