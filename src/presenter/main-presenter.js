import MoviesView from '../view/movies-view';
import SortView from '../view/sort-view';
import MoviesList from '../view/movies-list-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import MoviesListContainerView from '../view/movies-list-container-view';
import MoviesExtraView from '../view/movies-extra-view';
import {remove, render} from '../framework/render';
import MoviesListTitleView from '../view/movies-list-title-view';
import MoviesListEmptyView from '../view/movies-list-empty-view';
import MoviePresenter from './movie-presenter';
import {updateItem} from '../utils/common';

const MOVIES_COUNT_PER_STEP = 5;


export default class MainPresenter {
  #popupContainer = null;
  #moviesContainer = null;
  #moviesModel = null;
  #movies = null;
  #comments = null;

  constructor(popupContainer, moviesContainer, moviesModel, movies, comments) {
    this.#popupContainer = popupContainer;
    this.#moviesContainer = moviesContainer;
    this.#moviesModel = moviesModel;
    this.#movies = movies;
    this.#comments = comments;
  }

  #moviesComponent = new MoviesView();
  #moviesListComponent = new MoviesList();
  #moviesListContainerComponent = new MoviesListContainerView();
  #moviesExtraListRatedComponent = new MoviesExtraView('Top rated');
  #moviesExtraListCommentedComponent = new MoviesExtraView('Most commented');
  #moviesListContainerRatedComponent = new MoviesListContainerView();
  #moviesListContainerCommentedComponent = new MoviesListContainerView();
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #sortComponent = new SortView();
  #moviesListEmptyComponent = new MoviesListEmptyView();
  #moviesListTitleComponent = new MoviesListTitleView();
  #moviePresenter = new Map();
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;

  init() {
    const movies = [...this.#movies];
    const comments = [...this.#comments];

    this.#renderMain(movies, comments);
  }

  #renderSorting() {
    render(this.#sortComponent, this.#moviesContainer);
  }

  #renderMovie(movie, comments, container) {
    const moviePresenter = new MoviePresenter(this.#popupContainer, this.#onClickMovieUpdate);
    moviePresenter.init(movie, comments, container);
    this.#moviePresenter.set(movie.id, moviePresenter);
  }

  #renderShowMoreButton() {
    render(this.#buttonShowMoreComponent, this.#moviesListComponent.element);
    this.#buttonShowMoreComponent.setShowMoviesHandler(this.#onClickShowMore);
  }

  #renderMainMoviesList(movies, comments) {
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesComponent.element);

    if (movies.length === 0) {
      render(this.#moviesListEmptyComponent, this.#moviesListComponent.element);
      return;
    }

    render(this.#moviesListTitleComponent, this.#moviesListComponent.element);
    render(this.#moviesListContainerComponent, this.#moviesListComponent.element);

    if (movies.length > MOVIES_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }

    for (let i = 0; i < Math.min(movies.length, MOVIES_COUNT_PER_STEP); i++) {
      this.#renderMovie(movies[i], comments, this.#moviesListContainerComponent);
    }
  }

  #renderRated(movies, comments) {
    render(this.#moviesExtraListRatedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerRatedComponent, this.#moviesExtraListRatedComponent.element);
    for (const movie of movies.slice(0,2)) {
      this.#renderMovie(movie, comments, this.#moviesListContainerRatedComponent);
    }
  }

  #renderCommented(movies, comments) {
    render(this.#moviesExtraListCommentedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerCommentedComponent, this.#moviesExtraListCommentedComponent.element);
    for (const movie of movies.slice(3,5)) {
      this.#renderMovie(movie, comments, this.#moviesListContainerCommentedComponent);
    }
  }

  #renderMain (movies, comments) {
    this.#renderSorting();
    this.#renderMainMoviesList(movies, comments);
    this.#renderRated(movies, comments);
    this.#renderCommented(movies, comments);
  }

  #onClickShowMore = () => {
    this.#movies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#comments, this.#moviesListContainerComponent));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#movies.length) {
      this.#buttonShowMoreComponent.element.remove();
      this.#buttonShowMoreComponent.removeElement();
    }
  };

  #onClickMovieUpdate = (updatedMovie) => {
    this.#movies = updateItem(this.#movies, updatedMovie);
    this.#moviePresenter.get(updatedMovie.id).init(updatedMovie);
  };

  #clearMoviesList() {
    this.#moviePresenter.forEach((presenter) => presenter.destroy());
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    remove(this.#buttonShowMoreComponent);
  }
}
