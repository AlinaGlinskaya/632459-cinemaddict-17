import MovieCardView from '../view/movie-card-view';
import PopupSectionView from '../view/popup-section-view';
import {render, replace, remove, RenderPosition} from '../framework/render';
import {UserAction, UpdateType} from '../const';
import PopupFormView from '../view/popup-form-view';

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
  #popupSectionComponent = null;

  constructor(container, popupContainer, changeData, resetPopup, commentsModel) {
    this.#container = container;
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
    this.#resetPopup = resetPopup;
    this.#commentsModel = commentsModel;
    this.#commentsModel.addObserver(this.#changeData);
  }

  init(movie) {
    this.#movie = movie;
    const prevMovieCardComponent = this.#movieCardComponent;

    this.#movieCardComponent = new MovieCardView(movie, this.#movie.comments);

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
    } else {
      render(this.#movieCardComponent, this.#container.element);
    }
    remove(prevMovieCardComponent);

    if (this.#popupComponent) {
      this.openPopup();
    }
  }

  #onMovieClick() {
    this.openPopup();
  }

  #closePopup() {
    remove(this.#popupSectionComponent);
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupSectionComponent = null;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup(this.#onEscKeyDown);
    }
  };

  isOpenPopup() {
    return !!this.#popupSectionComponent;
  }

  openPopup = async (data = this.#movie) => {
    const comments = await this.#commentsModel.init(this.#movie.id).then(() => this.#commentsModel.comments);
    this.#movie = data;
    this.#resetPopup();
    const prevPopupComponent = this.#popupSectionComponent;
    this.#popupSectionComponent = new PopupSectionView();
    this.#popupComponent = new PopupFormView(this.#movie, comments, this.#commentsModel);
    this.#popupComponent.setClosePopupHandler(this.#onClickClosePopup);
    this.#popupComponent.setAddToWatchlistHandler(this.#onClickAddToWatchlist);
    this.#popupComponent.setAddToWatchedHandler(this.#onClickAddToWatched);
    this.#popupComponent.setAddToFavoriteHandler(this.#onClickAddToFavorite);
    this.#popupComponent.setDeleteCommentHandlers(this.#onClickDeleteComment);
    this.#popupComponent.setAddCommentHandler(this.#onKeyDownAddComment);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#onEscKeyDown);

    if (prevPopupComponent === null) {
      render(this.#popupSectionComponent, this.#popupContainer, RenderPosition.AFTEREND);
      render(this.#popupComponent, this.#popupSectionComponent.element);
    }
  };

  #onClickClosePopup = () => {
    this.#closePopup(this.#onEscKeyDown);
  };

  resetPopupView = () => {
    if (this.#popupSectionComponent === null) {
      return;
    }
    this.#closePopup(this.#onEscKeyDown);
  };

  setSaving() {
    this.#popupComponent.updateElement({isFormDisabled: true, isButtonDisabled: true});
  }

  setDeleting(comment) {
    this.#popupComponent.updateElement({isFormDisabled: true, isButtonDisabled: true, deletingId: comment});
  }

  resetPopupForm() {
    this.#popupComponent.updateElement({isFormDisabled: false, isButtonDisabled: false, deletingId: ''});
  }

  setAborting() {
    this.#popupComponent.shake(this.resetPopupForm);
  }

  #onClickAddToWatchlist = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
  };

  #onClickAddToWatched = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
  };

  #onClickAddToFavorite = () => {
    this.#changeData(
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
  };

  #onClickDeleteComment = (movie, comment) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      movie, comment);
  };

  #onKeyDownAddComment = (movie, comment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      movie, comment);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#popupSectionComponent);
  };
}
