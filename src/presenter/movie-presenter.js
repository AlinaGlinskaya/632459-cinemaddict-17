import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-view';
import {render, replace, remove} from '../framework/render';
import {RenderPosition} from '../render.js';
import {UserAction, UpdateType} from '../const';

const body = document.querySelector('body');

export default class MoviePresenter {
  #container = null;
  #popupContainer = null;
  #movieCardComponent = null;
  #popupComponent = null;
  #changeData = null;
  #movie = null;
  #resetPopup = null;
  #commentsModel = null;

  constructor(container, popupContainer, changeData, resetPopup, commentsModel) {
    this.#container = container;
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
    this.#resetPopup = resetPopup;
    this.#commentsModel = commentsModel;
    this.#commentsModel.addObserver(this.#changeData);
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init(movie) {
    this.#movie = movie;
    const prevMovieCardComponent = this.#movieCardComponent;

    this.#movieCardComponent = new MovieCardView(movie, this.comments);

    this.#movieCardComponent.setOpenPopupHandler(() => {
      this.#onMovieClick();
    });

    this.#movieCardComponent.setAddToWatchlistHandler(this.#onClickAddToWatchlist);
    this.#movieCardComponent.setAddToWatchedHandler(this.#onClickAddToWatched);
    this.#movieCardComponent.setAddToFavoriteHandler(this.#onClickAddToFavorite);

    if (prevMovieCardComponent === null) {
      render(this.#movieCardComponent, this.#container.element);
      return;
    }

    if (this.#container.element.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }
    remove(prevMovieCardComponent);

    if (this.#popupComponent) {
      this.openPopup(this.#movie);
    }
  }

  #onMovieClick() {
    this.openPopup(this.#movie);
  }

  #closePopup() {
    remove(this.#popupComponent);
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent = null;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup(this.#onEscKeyDown);
    }
  };

  openPopup(movie) {
    this.#resetPopup();
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(movie, this.comments, this.#commentsModel);
    this.#popupComponent.setClosePopupHandler(this.#onClickClosePopup);
    this.#popupComponent.setAddToWatchlistHandler(this.#onClickAddToWatchlist);
    this.#popupComponent.setAddToWatchedHandler(this.#onClickAddToWatched);
    this.#popupComponent.setAddToFavoriteHandler(this.#onClickAddToFavorite);
    this.#popupComponent.setDeleteCommentHandlers(this.#onClickDeleteComment);
    this.#popupComponent.setAddCommentHandler(this.#onKeyDownAddComment);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#popupContainer, RenderPosition.AFTEREND);
    }
  }

  #onClickClosePopup = () => {
    this.#closePopup(this.#onEscKeyDown);
  };

  resetPopupView = () => {
    if (this.#popupComponent === null) {
      return;
    }
    this.#closePopup(this.#onEscKeyDown);
  };

  #customUpdateElement(userAction, updateType, movie, comment) {
    this._position = this.#popupComponent ? this.#popupComponent.element.scrollTop : null;
    this.#changeData(userAction, updateType, movie, comment);
    if (this.#popupComponent) {
      this.#popupComponent.element.scrollTo(0, this._position);
    }
  }

  #onClickAddToWatchlist = () => {
    this.#customUpdateElement(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
  };

  #onClickAddToWatched = () => {
    this.#customUpdateElement(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
  };

  #onClickAddToFavorite = () => {
    this.#customUpdateElement(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
  };

  #onClickDeleteComment = (movie, comment) => {
    this.#customUpdateElement(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      movie, comment);
  };

  #onKeyDownAddComment = (movie, comment) => {
    this.#customUpdateElement(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      movie, comment);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#popupComponent);
  };
}
