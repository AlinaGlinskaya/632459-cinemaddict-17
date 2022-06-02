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
import {sortByDate, sortByRating} from '../utils/movie';
import {SortType} from '../const';
import MoviesModel from '../model/movies-model';
import CommentsModel from '../model/comments-model';
import {UserAction, UpdateType} from '../const';

const MOVIES_COUNT_PER_STEP = 5;

export default class MainPresenter {
  #popupContainer = null;
  #moviesContainer = null;

  constructor(popupContainer, moviesContainer) {
    this.#popupContainer = popupContainer;
    this.#moviesContainer = moviesContainer;
    this.#moviesModel.addObserver(this.#onModelEvent);
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
  #currentSortType = SortType.DEFAULT;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #moviesModel = new MoviesModel();
  #commentsModel = new CommentsModel();

  get movies() {
    switch (this.#currentSortType) {
      case SortType.DATE:
        return [...this.#moviesModel.movies].sort(sortByDate);
      case SortType.RATING:
        return [...this.#moviesModel.movies].sort(sortByRating);
    }
    return this.#moviesModel.movies;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init() {
    this.#renderMain();
  }

  #renderSorting() {
    render(this.#sortComponent, this.#moviesContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#onClickSortTypeChange);
  }

  #renderMovies = (movies, comments, container) => {
    movies.forEach((movie) => this.#renderMovie(movie, comments, container));
  };

  #renderMovie(movie, comments, container) {
    const moviePresenter = new MoviePresenter(container, this.#popupContainer, this.#onViewAction, this.#onClickPopupReset);
    moviePresenter.init(movie, comments);
    const currentPresenters = this.#moviePresenter.get(movie.id) || [];
    currentPresenters.push(moviePresenter);
    this.#moviePresenter.set(movie.id, currentPresenters);
  }

  #renderShowMoreButton() {
    render(this.#buttonShowMoreComponent, this.#moviesListComponent.element);
    this.#buttonShowMoreComponent.setShowMoviesHandler(this.#onClickShowMore);
  }

  #renderMainMoviesList(comments) {
    const moviesCount = this.movies.length;
    const movies = this.movies.slice(0, Math.min(moviesCount, MOVIES_COUNT_PER_STEP));
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesComponent.element);
    render(this.#moviesListTitleComponent, this.#moviesListComponent.element);
    render(this.#moviesListContainerComponent, this.#moviesListComponent.element);

    if (moviesCount > MOVIES_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
    this.#renderMovies(movies, comments, this.#moviesListContainerComponent);
  }

  #renderRated(comments) {
    const movies = this.movies.slice(0, 2);
    render(this.#moviesExtraListRatedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerRatedComponent, this.#moviesExtraListRatedComponent.element);
    this.#renderMovies(movies, comments, this.#moviesListContainerRatedComponent);
  }

  #renderCommented(comments) {
    const movies = this.movies.slice(3, 5);
    render(this.#moviesExtraListCommentedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerCommentedComponent, this.#moviesExtraListCommentedComponent.element);
    this.#renderMovies(movies, comments, this.#moviesListContainerCommentedComponent);
  }

  #renderMain() {
    if (this.movies.length === 0) {
      render(this.#moviesComponent, this.#moviesContainer);
      render(this.#moviesListComponent, this.#moviesComponent.element);
      render(this.#moviesListEmptyComponent, this.#moviesListComponent.element);
      return;
    }
    this.#renderSorting();
    this.#renderMainMoviesList(this.comments);
    this.#renderRated(this.comments);
    this.#renderCommented(this.comments);
  }

  #onClickShowMore = () => {
    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMoviesCount, newRenderedMoviesCount);
    this.#renderMovies(movies, this.comments, this.#moviesListContainerComponent);

    this.#renderedMoviesCount = newRenderedMoviesCount;

    if (this.#renderedMoviesCount >= moviesCount) {
      remove(this.#buttonShowMoreComponent);
    }
  };

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this.#moviePresenter.has(data.id)) {
          this.#moviePresenter.get(data.id).forEach((presenter) => presenter.init(data, this.comments));
        }
        break;
    }
  };

  #onViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  };

  #onClickPopupReset = () => {
    this.#moviePresenter.forEach((presenters) => presenters.forEach((presenter) => presenter.resetPopupView()));
  };

  #onClickSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearMoviesList();
    this.#renderMain();
  };

  #clearMoviesList() {
    this.#moviePresenter.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));
    this.#moviePresenter.clear();
    this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    remove(this.#buttonShowMoreComponent);
  }
}
