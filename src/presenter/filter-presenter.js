import {render, replace, remove} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import {Filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #moviesModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, moviesModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;

    this.#moviesModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const movies = this.#moviesModel.movies;

    return [
      {
        type: FilterType.ALL,
        name: 'All movies',
        count: movies.length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: movies.filter(Filter.watchlist).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: movies.filter(Filter.history).length,
      },
      {
        type: FilterType.FAVORITE,
        name: 'Favorite',
        count: movies.filter(Filter.favorite).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeClickHandler(this.#handleFilterTypeClick);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeClick = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
