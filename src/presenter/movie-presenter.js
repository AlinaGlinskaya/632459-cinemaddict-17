import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-veiw';
import {render, replace, remove} from '../framework/render';
import {RenderPosition} from '../render.js';

const body = document.querySelector('body');
const PopupState = {
  OPENED: 'OPENED:',
  CLOSED: 'CLOSED'
};

export default class MoviePresenter {
  #popupContainer = null;
  #movieCardComponent = null;
  #popupComponent = null;
  #changeData = null;
  #movie = null;
  #comments = null;
  #userDetails = null;
  #resetPopup = null;
  #popupState = PopupState.CLOSED;

  constructor(popupContainer, changeData, resetPopup) {
    this.#popupContainer = popupContainer;
    this.#changeData = changeData;
    this.#resetPopup = resetPopup;
  }

  init(movie, comments, container) {
    this.#movie = movie;
    this.#comments = comments;
    this.#userDetails = this.#movie.userDetails;
    const prevMovieCardComponent = this.#movieCardComponent;

    this.#movieCardComponent = new MovieCardView(movie);

    this.#movieCardComponent.setOpenPopupHandler(() => {
      this.#onMovieClick();
    });

    this.#movieCardComponent.setAddToWatchlistHandler(this.#onClickAddToWatchlist);
    this.#movieCardComponent.setAddToWatchedHandler(this.#onClickAddToWatched);
    this.#movieCardComponent.setAddToFavoriteHandler(this.#onClickAddToFavorite);

    if (prevMovieCardComponent === null) {
      render(this.#movieCardComponent, container.element);
      return;
    }

    if (document.body.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }
    remove(prevMovieCardComponent);
  }

  #onMovieClick() {
    if (this.#popupState === 'OPENED') {
      this.#closePopup(this.#onEscKeyDown);
    }
    this.#openPopup(this.#onEscKeyDown);
    this.#popupComponent.setClosePopupHandler(this.#onClickClosePopup);
    this.#resetPopup();
  }

  #closePopup(handler) {
    if (this.#popupState === 'OPENED') {
      this.#closePopup(this.#onEscKeyDown);
    }
    remove(this.#popupComponent);
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', handler);
    this.#popupState = PopupState.CLOSED;
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup(this.#onEscKeyDown);
    }
  };

  #openPopup(handler) {
    this.#popupComponent = new PopupView(this.#movie, this.#comments);
    render(this.#popupComponent, this.#popupContainer, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', handler);
    this.#popupState = PopupState.OPENED;
  }

  #onClickClosePopup = () => {
    this.#closePopup(this.#onEscKeyDown);
  };

  resetPopupView = () => {
    if (this.#popupState === PopupState.OPENED) {
      this.#closePopup(this.#onEscKeyDown);
    }
  };

  #onClickAddToWatchlist = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#userDetails, watchlist: !this.#userDetails.watchlist}});
  };

  #onClickAddToWatched = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#userDetails, alreadyWatched: !this.#userDetails.alreadyWathced}});
  };

  #onClickAddToFavorite = () => {
    this.#changeData({...this.#movie, userDetails: {...this.#userDetails, favorite: !this.#userDetails.favorite}});
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#popupComponent);
  };
}
