import AbstractView from '../framework/view/abstract-view';

const createLoadingMoviesTemplate = () => '<h2 class="films-list__title">Loading...</h2>';

export default class LoadingMoviesView extends AbstractView {
  get template() {
    return createLoadingMoviesTemplate();
  }
}
