import MovieCardView from '../view/movie-card-view';
import PopupView from '../view/popup-veiw';
import {render} from '../framework/render';
import {RenderPosition} from '../render.js';

const body = document.querySelector('body');

export default class MoviePresenter {
  #popupContainer = null;
  #movies = null;
  #comments = null;

  constructor(popupContainer, movies, comments) {
    this.#popupContainer = popupContainer;
    this.#movies = movies;
    this.#comments = comments;
  }

  init(movie, comments, container) {
    const movieCardComponent = new MovieCardView(movie);
    const popup = new PopupView(movie, comments);

    movieCardComponent.setOpenPopupHandler(() => {
      if (document.body.querySelector('.film-details')) {
        this.#closePopup(this.#onEscKeyDown);
      }
      this.#openPopup(popup, this.#onEscKeyDown);
    });

    popup.setClosePopupHandler(this.#onClickClosePopup);
    render(movieCardComponent, container.element);
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
}
