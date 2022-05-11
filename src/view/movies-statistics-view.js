import AbstractView from '../framework/view/abstract-view';

const createMoviesStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class MoviesStaticticsView extends AbstractView {
  get template() {
    return createMoviesStatisticsTemplate();
  }
}
