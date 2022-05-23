import AbstractView from '../framework/view/abstract-view';
import {ucFirst} from '../utils/common';
import {FILTER_TYPES} from '../const';

const createMainNavTemplate = (filters) => {

  const createFiltersTemplate = () => filters.map((filter) => `<a href="#${filter.name}" class="main-navigation__item ${filter.name === FILTER_TYPES.ALL ? 'main-navigation__item--active' : ''}">${ucFirst(filter.name)} ${filter.name === 'all movies' ? '' : `<span class="main-navigation__item-count">${filter.count}</span>`} </a>`).join('');

  const filtersTemplate = createFiltersTemplate(filters);
  return `<nav class="main-navigation">
    ${filtersTemplate}
  </nav>`;
};

export default class MainNavView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainNavTemplate(this.#filters);
  }
}
