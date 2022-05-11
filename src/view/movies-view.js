import AbstractView from '../framework/view/abstract-view';

const createMoviesViewTemplate = () => '<section class="films"></section>';

export default class MoviesView extends AbstractView {
  get template() {
    return createMoviesViewTemplate();
  }
}
