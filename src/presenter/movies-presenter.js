import MoviesView from '../view/movies-view';
import SortView from '../view/sort-view';
import MoviesList from '../view/movies-list';
import ButtonShowMoreView from '../view/button-show-more-view';
import MoviesListContainerView from '../view/movies-list-container-view';
import MovieCardView from '../view/movie-card-view';
import MoviesExtraView from '../view/movies-extra-view';
import {render} from '../render.js';

export default class MoviesPresenter {
  moviesComponent = new MoviesView();
  moviesList = new MoviesList();
  moviesListContainer = new MoviesListContainerView();
  moviesExtraListRated = new MoviesExtraView('Top rated');
  moviesExtraListCommented = new MoviesExtraView('Most commented');
  moviesListContainerRated = new MoviesListContainerView();
  moviesListContainerCommented = new MoviesListContainerView();

  init = (moviesContainer, heading) => {
    this.moviesContainer = moviesContainer;
    this.heading = heading;

    render(new SortView(), this.moviesContainer);
    render(this.moviesComponent, this.moviesContainer);
    render(this.moviesList, this.moviesComponent.getElement());
    render(this.moviesListContainer, this.moviesList.getElement());

    for (let i = 0; i < 5; i++) {
      render(new MovieCardView(), this.moviesListContainer.getElement());
    }

    render(new ButtonShowMoreView(), this.moviesList.getElement());

    render(this.moviesExtraListRated, this.moviesComponent.getElement());
    render(this.moviesListContainerRated, this.moviesExtraListRated.getElement());
    for (let i = 0; i < 2; i++) {
      render(new MovieCardView(), this.moviesListContainerRated.getElement());
    }

    render(this.moviesExtraListCommented, this.moviesComponent.getElement());
    render(this.moviesListContainerCommented, this.moviesExtraListCommented.getElement());
    for (let i = 0; i < 2; i++) {
      render(new MovieCardView(), this.moviesListContainerCommented.getElement());
    }
  };
}
