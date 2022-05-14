import AbstractView from '../framework/view/abstract-view';
import {ucFirst} from '../utils/common';

const createMainNavTemplate = (filters) => {

  const createFiltersTemplate = () => filters.map((filter) => `<a href="#${filter.name}" class="main-navigation__item">${ucFirst(filter.name)} <span class="main-navigation__item-count">${filter.count}</span></a>`).join('');

  const filtersTemplate = createFiltersTemplate(filters);
  return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
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
