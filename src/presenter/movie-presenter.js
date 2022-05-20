import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-veiw';
import {render, replace, remove} from '../framework/render';
import {RenderPosition} from '../render.js';

const body = document.querySelector('body');

export default class MoviePresenter {
  #popupContainer = null;
  #movieCardComponent = null;
  #popupComponent = null;

  constructor(popupContainer) {
    this.#popupContainer = popupContainer;
  }

  init(movie, comments, container) {
    const prevMovieCardComponent = this.#movieCardComponent;
    this.#movieCardComponent = new MovieCardView(movie);

    if (prevMovieCardComponent === null) {
      render(this.#movieCardComponent, container.element);
      this.#movieCardComponent.setOpenPopupHandler(() => {
        this.#onMovieClick(movie, comments);
      });
      return;
    }

    if (document.body.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    remove(prevMovieCardComponent);
  }

  #onMovieClick(movie, comments) {
    this.#popupComponent = new PopupView(movie, comments);

    if (document.body.querySelector('.film-details')) {
      this.#closePopup(this.#onEscKeyDown);
    }

    this.#openPopup(this.#popupComponent, this.#onEscKeyDown);
    this.#popupComponent.setClosePopupHandler(this.#onClickClosePopup);
  }

  #closePopup(handler) {
    body.querySelector('.film-details').remove();
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', handler);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup(this.#onEscKeyDown);
    }
  };

  #openPopup(popup, handler) {
    render(popup, this.#popupContainer, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', handler);
  }

  #onClickClosePopup = () => {
    this.#closePopup(this.#onEscKeyDown);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#popupComponent);
  };
}
