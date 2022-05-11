import AbstractView from '../framework/view/abstract-view';

const createMoviesListTemplate = () => '<section class="films-list"></section>';

export default class MoviesListView extends AbstractView {
  get template() {
    return createMoviesListTemplate();
  }
}
