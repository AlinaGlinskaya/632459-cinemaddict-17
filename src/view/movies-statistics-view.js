import AbstractView from '../framework/view/abstract-view';

const createMoviesStatisticsTemplate = (moviesCount) => `<p>${moviesCount} movies inside</p>`;

export default class MoviesStaticticsView extends AbstractView {
  #moviesCount = null;

  constructor(moviesCount) {
    super();
    this.#moviesCount = moviesCount;
  }

  get template() {
    return createMoviesStatisticsTemplate(this.#moviesCount);
  }
}
