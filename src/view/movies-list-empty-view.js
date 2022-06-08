import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../const';

const NoMoviesTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now',
};

const createMoviesListEmptyTemplate = (filterType) => {
  const noMoviesTextValue = NoMoviesTextType[filterType];

  return (
    `<h2 class="films-list__title">${noMoviesTextValue}</h2>`
  );
};

export default class MoviesListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createMoviesListEmptyTemplate(this.#filterType);
  }
}
