import MoviesView from '../view/movies-view';
import SortView from '../view/sort-view';
import MoviesList from '../view/movies-list-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import MoviesListContainerView from '../view/movies-list-container-view';
import MoviesExtraView from '../view/movies-extra-view';
import {remove, render, RenderPosition} from '../framework/render';
import MoviesListTitleView from '../view/movies-list-title-view';
import MoviesListEmptyView from '../view/movies-list-empty-view';
import MoviePresenter from './movie-presenter';
import {sortByDate, sortByRating} from '../utils/movie';
import {SortType, UserAction, UpdateType, FilterType} from '../const';
import {filter} from '../utils/filter';
import LoadingMoviesView from '../view/loading-movies-view';

const MOVIES_COUNT_PER_STEP = 5;

export default class MainPresenter {
  #popupContainer = null;
  #moviesContainer = null;
  #filterModel = null;
  #moviesModel = null;
  #commentsModel = null;

  constructor(popupContainer, moviesContainer, filterModel, moviesModel, commentsModel) {
    this.#popupContainer = popupContainer;
    this.#moviesContainer = moviesContainer;
    this.#filterModel = filterModel;
    this.#moviesModel = moviesModel;
    this.#commentsModel = commentsModel;

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
  #moviesListEmptyComponent = null;
  #moviesListTitleComponent = new MoviesListTitleView();
  #loadingMoviesComponent = new LoadingMoviesView();
  #moviePresenter = new Map();
  #moviePresenterRated = new Map();
  #moviePresenterCommented = new Map();
  #moviePresenters = [this.#moviePresenter, this.#moviePresenterRated, this.#moviePresenterCommented];
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;
  #isLoading = true;


  get movies() {
    this.#filterType = this.#filterModel.filter;
    const movies = this.#moviesModel.movies;
    const filteredMovies = [];
    for (const movie of movies) {
      if(filter[this.#filterType](movie)) {
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

  init() {
    this.#renderMain();
  }

  #renderSorting() {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#onClickSortTypeChange);
    render(this.#sortComponent, this.#moviesContainer);
  }

  #renderLoading() {
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesComponent.element);
    render(this.#loadingMoviesComponent, this.#moviesListComponent.element);
  }

  #renderMovies = (movies, container, mapPresenters) => {
    movies.forEach((movie) => this.#renderMovie(movie, container, mapPresenters));
  };

  #renderMovie(movie, container, mapPresenters) {
    if (mapPresenters.has(movie.id)) {
      mapPresenters.get(movie.id).init(movie);
      return;
    }

    const moviePresenter = new MoviePresenter(container, this.#popupContainer, this.#onViewAction, this.#onClickPopupReset, this.#commentsModel);
    moviePresenter.init(movie);
    mapPresenters.set(movie.id, moviePresenter);
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
    this.#renderMovies(movies, this.#moviesListContainerRatedComponent, this.#moviePresenterRated);
  }

  #renderCommented() {
    const movies = this.movies.slice(3, 5);
    render(this.#moviesExtraListCommentedComponent, this.#moviesComponent.element);
    render(this.#moviesListContainerCommentedComponent, this.#moviesExtraListCommentedComponent.element);
    this.#renderMovies(movies, this.#moviesListContainerCommentedComponent, this.#moviePresenterCommented);
  }

  #renderMain() {
    const movies = this.movies;
    const moviesCount = movies.length;

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (moviesCount === 0) {
      this.#moviesListEmptyComponent = new MoviesListEmptyView(this.#filterType);
      render(this.#moviesComponent, this.#moviesContainer);
      render(this.#moviesListComponent, this.#moviesComponent.element);
      render(this.#moviesListEmptyComponent, this.#moviesListComponent.element);
      return;
    }

    this.#renderSorting();
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesListComponent, this.#moviesComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#moviesListTitleComponent, this.#moviesListComponent.element);
    render(this.#moviesListContainerComponent, this.#moviesListComponent.element);

    if (moviesCount > this.#renderedMoviesCount) {
      this.#renderShowMoreButton();
    }

    this.#renderMovies(movies.slice(0, Math.min(moviesCount, this.#renderedMoviesCount)), this.#moviesListContainerComponent, this.#moviePresenter);
    this.#renderRated();
    this.#renderCommented();
  }

  #onClickShowMore = () => {
    const moviesCount = this.movies.length;
    const newRenderedMoviesCount = Math.min(moviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedMoviesCount, newRenderedMoviesCount);
    this.#renderMovies(movies, this.#moviesListContainerComponent, this.#moviePresenter);

    this.#renderedMoviesCount = newRenderedMoviesCount;

    if (this.#renderedMoviesCount >= moviesCount) {
      remove(this.#buttonShowMoreComponent);
    }
  };

  #updatePopup(data) {
    this.#moviePresenters.forEach((presenters) => {
      const moviePresenter = presenters.get(data.id);
      if (moviePresenter && moviePresenter.isOpenPopup()) {
        moviePresenter.openPopup(data);
      }
    });
  }

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviePresenters.forEach((presenters) => {
          const moviePresenter = presenters.get(data.id);
          if (moviePresenter) {
            moviePresenter.init(data);
          }
        });
        break;
      case UpdateType.MINOR:
        this.#clearMain({resetPresenters: false});
        this.#renderMain();
        this.#updatePopup(data);
        break;
      case UpdateType.MAJOR:
        this.#clearMain({resetRenderedMoviesCount: true, resetSortType: true});
        this.#renderMain();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingMoviesComponent);
        this.#renderMain();
        break;
    }
  };

  #onViewAction = (actionType, updateType, updateMovie, updateComment) => {
    switch (actionType) {
      case UserAction.UPDATE_MOVIE:
        this.#moviesModel.updateMovie(updateType, updateMovie);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, updateMovie, updateComment);
        this.#moviesModel.updateMovie(updateType, updateMovie);
        this.#moviePresenters.forEach((presenters) => {
          const moviePresenter = presenters.get(updateMovie);
          if (moviePresenter && moviePresenter.isOpenPopup()) {
            moviePresenter.setSaving();
          }
        });
        break;
      case UserAction.DELETE_COMMENT:
        this.#moviePresenters.forEach((presenters) => {
          const moviePresenter = presenters.get(updateMovie.id);
          if (moviePresenter && moviePresenter.isOpenPopup()) {
            moviePresenter.setDeleting(updateComment);
          }
        });
        this.#commentsModel.deleteComment(updateType, updateMovie, updateComment);
        this.#moviesModel.updateMovie(updateType, updateMovie);
        break;
    }
  };

  #onClickPopupReset = () => {
    this.#moviePresenters
      .forEach((map) => [...map.values()]
        .forEach((presenter) => presenter.resetPopupView()));
  };

  #onClickSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearMain({resetRenderedMoviesCount: true});
    this.#renderMain();
  };

  #clearMain = ({resetPresenters = true, resetRenderedMoviesCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    if (resetPresenters) {
      this.#moviePresenters
        .forEach((map) => {
          [...map.values()].forEach((presenter) => presenter.destroy());
          map.clear();
        });
    }

    remove(this.#sortComponent);
    remove(this.#buttonShowMoreComponent);
    remove(this.#loadingMoviesComponent);
    remove(this.#moviesExtraListCommentedComponent);
    remove(this.#moviesExtraListRatedComponent);

    this.#moviesListContainerComponent.clear();
    this.#moviesListContainerRatedComponent.clear();
    this.#moviesListContainerCommentedComponent.clear();

    if (this.#moviesListEmptyComponent) {
      remove(this.#moviesListEmptyComponent);
    }

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
