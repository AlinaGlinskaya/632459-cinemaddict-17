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
import {sortByDate, sortByRating} from '../utils/movie';
import {SortType} from '../const';
import MoviesModel from '../model/movies-model';
import CommentsModel from '../model/comments-model';

const MOVIES_COUNT_PER_STEP = 5;

export default class MainPresenter {
  #popupContainer = null;
  #moviesContainer = null;

  constructor(popupContainer, moviesContainer) {
    this.#popupContainer = popupContainer;
    this.#moviesContainer = moviesContainer;
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
  #unsortedMovies = [];
  #currentSortType = SortType.DEFAULT;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #moviesModel = new MoviesModel();
  #commentsModel = new CommentsModel();

  get movies() {
    return this.#moviesModel.movies;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init() {
    const movies = [...this.movies];

    this.#unsortedMovies = [...this.movies];

    this.#renderMain(movies, this.comments);
  }

  #renderSorting() {
    render(this.#sortComponent, this.#moviesContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#onClickSortTypeChange);
  }

  #renderMovies = (from, to, comments, container) => {
    this.movies
      .slice(from, to)
      .forEach((movie) => this.#renderMovie(movie, comments, container));
  };

  #renderMovie(movie, comments, container) {
    const moviePresenter = new MoviePresenter(container, this.#popupContainer, this.#onClickMovieUpdate, this.#onClickPopupReset);
    moviePresenter.init(movie, comments);
    const currentPresenters = this.#moviePresenter.get(movie.id) || [];
    currentPresenters.push(moviePresenter);
    this.#moviePresenter.set(movie.id, currentPresenters);
  }

  #renderShowMoreButton() {
    render(this.#buttonShowMoreComponent, this.#moviesListComponent.element);
    this.#buttonShowMoreComponent.setShowMoviesHandler(this.#onClickShowMore);
  }

  #renderMainMoviesList(movies, comments) {
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesComponent.element);
    render(this.#moviesListTitleComponent, this.#moviesListComponent.element);
    render(this.#moviesListContainerComponent, this.#moviesListComponent.element);

    if (movies.length > MOVIES_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
    this.#renderMovies(0, Math.min(movies.length, MOVIES_COUNT_PER_STEP), comments, this.#moviesListContainerComponent);
  }

  #renderRated(comments) {
    render(this.#moviesExtraListRatedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerRatedComponent, this.#moviesExtraListRatedComponent.element);
    this.#renderMovies(0, 2, comments, this.#moviesListContainerRatedComponent);
  }

  #renderCommented(comments) {
    render(this.#moviesExtraListCommentedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerCommentedComponent, this.#moviesExtraListCommentedComponent.element);
    this.#renderMovies(3, 5, comments, this.#moviesListContainerCommentedComponent);
  }

  #renderMain(movies, comments) {
    if (movies.length === 0) {
      render(this.#moviesComponent, this.#moviesContainer);
      render(this.#moviesListComponent, this.#moviesComponent.element);
      render(this.#moviesListEmptyComponent, this.#moviesListComponent.element);
      return;
    }
    this.#renderSorting();
    this.#renderMainMoviesList(movies, comments);
    this.#renderRated(comments);
    this.#renderCommented(comments);
  }

  #onClickShowMore = () => {
    this.movies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.comments, this.#moviesListContainerComponent));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.movies.length) {
      this.#buttonShowMoreComponent.element.remove();
      this.#buttonShowMoreComponent.removeElement();
    }
  };

  #onClickMovieUpdate = (updatedMovie) => {
    this.movies = updateItem(this.movies, updatedMovie);
    this.#unsortedMovies = updateItem(this.#unsortedMovies, updatedMovie);
    if (this.#moviePresenter.has(updatedMovie.id)) {
      this.#moviePresenter.get(updatedMovie.id).forEach((presenter) => presenter.init(updatedMovie, this.comments));
    }
  };

  #onClickPopupReset = () => {
    this.#moviePresenter.forEach((presenters) => presenters.forEach((presenter) => presenter.resetPopupView()));
  };

  #sortMovies = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.movies.sort(sortByDate);
        break;
      case SortType.RATING:
        this.movies.sort(sortByRating);
        break;
      default:
        this.movies = [...this.#unsortedMovies];
    }

    this.#currentSortType = sortType;
  };

  #onClickSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortMovies(sortType);
    this.#clearMoviesList();
    this.#renderMain(this.movies, this.comments);
  };

  #clearMoviesList() {
    this.#moviePresenter.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    remove(this.#buttonShowMoreComponent);
  }
}
