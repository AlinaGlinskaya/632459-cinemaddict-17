import {createElement} from '../render.js';

const createMoviesStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class MoviesStaticticsView {
  getTemplate() {
    return createMoviesStatisticsTemplate;
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
