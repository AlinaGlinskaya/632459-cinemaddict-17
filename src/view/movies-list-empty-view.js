import AbstractView from '../framework/view/abstract-view';

const createMoviesListEmptyTemplate = () => '<h2 class="films-list__title">There are no movies in our database</h2>';

export default class MoviesListEmptyView extends AbstractView {
  get template() {
    return createMoviesListEmptyTemplate();
  }
}
