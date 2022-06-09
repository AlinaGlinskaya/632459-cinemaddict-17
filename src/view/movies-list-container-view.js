import AbstractView from '../framework/view/abstract-view';

const createMoviesListContainerTemplate = () => '<div class="films-list__container"></div';

export default class MoviesListContainerView extends AbstractView {
  get template() {
    return createMoviesListContainerTemplate();
  }

  clear() {
    this.element.innerHTML = '';
  }
}
