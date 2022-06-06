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
import {filter} from '../utils/filter';

const MOVIES_COUNT_PER_STEP = 5;

export default class MainPresenter {
  #popupContainer = null;
  #moviesContainer = null;
  #filterModel = null;

  constructor(popupContainer, moviesContainer, filterModel) {
    this.#popupContainer = popupContainer;
    this.#moviesContainer = moviesContainer;
    this.#filterModel = filterModel;
    this.#moviesModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  #moviesComponent = new MoviesView();
  #moviesListComponent = new MoviesList();
  #moviesListContainerComponent = new MoviesListContainerView();
  #moviesExtraListRatedComponent = new MoviesExtraView('Top rated');
  #moviesExtraListCommentedComponent = new MoviesExtraView('Most commented');
  #moviesListContainerRatedComponent = new MoviesListContainerView();
  #moviesListContainerCommentedComponent = new MoviesListContainerView();
  #buttonShowMoreComponent = null;
  #sortComponent = null;
  #moviesListEmptyComponent = new MoviesListEmptyView();
  #moviesListTitleComponent = new MoviesListTitleView();
  #moviePresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #moviesModel = new MoviesModel();
  #commentsModel = new CommentsModel();

  get movies() {
    const filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = [];
    for (const movie of movies) {
      if(filter[filterType](movie)) {
        filteredMovies.push(movie);
      }
    }

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredMovies.sort(sortByDate);
      case SortType.RATING:
        return filteredMovies.sort(sortByRating);
    }
    return filteredMovies;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init() {
    this.#renderMain();
  }

  #renderSorting() {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#onClickSortTypeChange);
    render(this.#sortComponent, this.#moviesContainer);
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
    this.#buttonShowMoreComponent = new ButtonShowMoreView();
    render(this.#buttonShowMoreComponent, this.#moviesListComponent.element);
    this.#buttonShowMoreComponent.setShowMoviesHandler(this.#onClickShowMore);
  }

  #renderRated() {
    const movies = this.movies.slice(0, 2);
    render(this.#moviesExtraListRatedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerRatedComponent, this.#moviesExtraListRatedComponent.element);
    this.#renderMovies(movies, this.comments, this.#moviesListContainerRatedComponent);
  }

  #renderCommented() {
    const movies = this.movies.slice(3, 5);
    render(this.#moviesExtraListCommentedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerCommentedComponent, this.#moviesExtraListCommentedComponent.element);
    this.#renderMovies(movies, this.comments, this.#moviesListContainerCommentedComponent);
  }

  #renderMain() {
    const movies = this.movies;
    const moviesCount = movies.length;

    if (moviesCount === 0) {
      render(this.#moviesComponent, this.#moviesContainer);
      render(this.#moviesListComponent, this.#moviesComponent.element);
      render(this.#moviesListEmptyComponent, this.#moviesListComponent.element);
      return;
    }

    this.#renderSorting();
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesComponent.element);
    render(this.#moviesListTitleComponent, this.#moviesListComponent.element);
    render(this.#moviesListContainerComponent, this.#moviesListComponent.element);

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)), this.comments, this.#moviesListContainerComponent);
    this.#renderRated();
    this.#renderCommented();
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
      case UpdateType.MINOR:
        this.#clearMain();
        this.#renderMain();
        break;
      case UpdateType.MAJOR:
        this.#clearMain({resetRenderedTaskCount: true, resetSortType: true});
        this.#renderMain();
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
    this.#clearMain({resetRenderedMoviesCount: true});
    this.#renderMain();
  };

  #clearMain = ({resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#moviePresenter.forEach((presenters) => presenters.forEach((presenter) => presenter.destroy()));
    this.#moviePresenter.clear();
    remove(this.#sortComponent);
    remove(this.#buttonShowMoreComponent);

    if (resetRenderedMoviesCount) {
      this.#renderedMoviesCount = MOVIES_COUNT_PER_STEP;
    } else {
      this.#renderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };
}
