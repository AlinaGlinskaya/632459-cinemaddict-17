import MovieCardView from '../view/movie-card-view';
import PopupSectionView from '../view/popup-section-view';
import {render, replace, remove, RenderPosition} from '../framework/render';
import {UserAction, UpdateType} from '../const';
import PopupFormView from '../view/popup-form-view';

export default class MoviePresenter {
  #container = null;
  #footerElement = null;
  #movieCardComponent = null;
  #popupFormComponent = null;
  #changeData = null;
  #movie = null;
  #resetPopup = null;
  #commentsModel = null;
  #popupSectionComponent = null;
  #scrollPosition = null;
  #popupFormInfo = null;
  #popupContainer = null;

  constructor(container, footerElement, changeData, resetPopup, commentsModel, popupContainer) {
    this.#container = container;
    this.#footerElement = footerElement;
    this.#changeData = changeData;
    this.#resetPopup = resetPopup;
    this.#commentsModel = commentsModel;
    this.#popupContainer = popupContainer;
    this.#commentsModel.addObserver(this.#changeData);
  }

  init(movie) {
    this.#movie = movie;
    const prevMovieCardComponent = this.#movieCardComponent;

    this.#movieCardComponent = new MovieCardView(movie, this.#movie.comments);

    this.#movieCardComponent.setOpenPopupClickHandler(() => {
      this.#handleMovieClick();
    });

    this.#movieCardComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchlistClick);
    this.#movieCardComponent.setAddToWatchedClickHandler(this.#handleAddToWatchedClick);
    this.#movieCardComponent.setAddToFavoriteClickHandler(this.#handleAddToFavoriteClick);

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

    if (this.#popupSectionComponent) {
      this.openPopup();
    }
  }

  #handleMovieClick() {
    this.openPopup();
  }

  #closePopup() {
    remove(this.#popupSectionComponent);
    this.#popupContainer.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#popupSectionComponent = null;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup(this.#escKeyDownHandler);
    }
  };

  isOpenedPopup() {
    return !!this.#popupSectionComponent;
  }

  openPopup = async (data = this.#movie) => {
    const comments = await this.#commentsModel.init(this.#movie.id).then(() => this.#commentsModel.comments);
    this.#movie = data;
    this.#resetPopup();
    const prevPopupSectionComponent = this.#popupSectionComponent;
    this.#popupSectionComponent = new PopupSectionView();
    this.#popupFormComponent = new PopupFormView(this.#movie, comments, this.#commentsModel);
    this.#popupFormComponent.setClosePopupClickHandler(this.#handleClosePopupClick);
    this.#popupFormComponent.setAddToWatchlistClickHandler(this.#handleAddToWatchlistClick);
    this.#popupFormComponent.setAddToWatchedClickHandler(this.#handleAddToWatchedClick);
    this.#popupFormComponent.setAddToFavoriteClickHandler(this.#handleAddToFavoriteClick);
    this.#popupFormComponent.setDeleteCommentClickHandlers(this.#handleDeleteCommentClick);
    this.#popupFormComponent.setAddCommentKeyDownHandler(this.#handleAddCommentKeyDown);
    this.#popupContainer.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);

    if (prevPopupSectionComponent === null) {
      render(this.#popupSectionComponent, this.#footerElement, RenderPosition.AFTEREND);
      render(this.#popupFormComponent, this.#popupSectionComponent.element);
      this.#popupSectionComponent.element.scrollTo(0, this.#scrollPosition);
      this.#popupFormComponent.updateElement(this.#popupFormInfo);
    }
  };

  #handleClosePopupClick = () => {
    this.#closePopup(this.#escKeyDownHandler);
  };

  resetPopupView = () => {
    if (this.#popupSectionComponent === null) {
      return;
    }
    this.#closePopup(this.#escKeyDownHandler);
  };

  setSaving() {
    this.#popupFormComponent.updateElement({isFormDisabled: true, isButtonDisabled: true});
  }

  setDeleting(comment) {
    this.#popupFormComponent.updateElement({isFormDisabled: true, isButtonDisabled: true, deletingId: comment});
  }

  setAborting() {
    const resetPopupForm = () => {
      this.#popupFormComponent.updateElement({isFormDisabled: false, isButtonDisabled: false, deletingId: ''});
    };
    this.#popupFormComponent.shake(resetPopupForm);
  }

  #customUpdateElement(isSavingUserInfo, userAction, updateType, movie, comment) {
    if (this.#popupSectionComponent) {
      this.#scrollPosition = this.#popupSectionComponent.element.scrollTop;
      this.#popupFormInfo = isSavingUserInfo ? this.#popupFormComponent._state : '';
    }
    this.#changeData(userAction, updateType, movie, comment);
  }

  #handleAddToWatchlistClick = () => {
    this.#customUpdateElement(
      true,
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, watchlist: !this.#movie.userDetails.watchlist}});
  };

  #handleAddToWatchedClick = () => {
    this.#customUpdateElement(
      true,
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, alreadyWatched: !this.#movie.userDetails.alreadyWatched}});
  };

  #handleAddToFavoriteClick = () => {
    this.#customUpdateElement(
      true,
      UserAction.UPDATE_MOVIE,
      UpdateType.MINOR,
      {...this.#movie, userDetails: {...this.#movie.userDetails, favorite: !this.#movie.userDetails.favorite}});
  };

  #handleDeleteCommentClick = (movie, comment) => {
    this.#customUpdateElement(
      true,
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      movie, comment);
  };

  #handleAddCommentKeyDown = (movie, comment) => {
    this.#customUpdateElement(
      false,
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      movie, comment);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#popupSectionComponent);
  };
}
