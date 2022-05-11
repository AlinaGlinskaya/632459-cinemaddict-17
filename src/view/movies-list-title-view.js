import AbstractView from '../framework/view/abstract-view';

const createMoviesListTitleTemplate = () => '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';

export default class MoviesListTitleView extends AbstractView {
  get template() {
    return createMoviesListTitleTemplate();
  }
}
