import AbstractView from '../framework/view/abstract-view';
import {humanizeMovieReleaseYearDate, getTimeFromMins} from '../utils/movie';

const createMovieCardTemplate = (movie) => {
  const {title, description, totalRating, poster, runtime, genre} = movie.filmInfo;
  const {date} = movie.filmInfo.release;

  const commentsAmount = movie.comments.length;
  const releaseDate = humanizeMovieReleaseYearDate(date);
  const filmDuration = getTimeFromMins(runtime);
  const activeMovieControlsClassname = 'film-card__controls-item--active';

  const createMovieControlsTemplate = (userDetails, activeClass) => (`<button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${userDetails.watchlist ? activeClass : ''}" type="button">Add to watchlist</button>
  <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${userDetails.alreadyWatched ? activeClass : ''}" type="button">Mark as watched</button>
  <button class="film-card__controls-item film-card__controls-item--favorite ${userDetails.favorite ? activeClass : ''}" type="button">Mark as favorite</button>`);

  const movieControlsTemplate = createMovieControlsTemplate(movie.userDetails, activeMovieControlsClassname);

  return (
    `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsAmount} comments</span>
    </a>
    <div class="film-card__controls">
      ${movieControlsTemplate}
    </div>
  </article>`);
};

export default class MovieCardView extends AbstractView {
  #movie = null;
  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieCardTemplate(this.#movie);
  }

  setOpenPopupHandler = (callback) => {
    this._callback.openPopupClick = callback;
    this.element.addEventListener('click', this.#openPopupHandler);
  };

  setAddToWatchlistHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addToWatchlistHandler);
  };

  setAddToWatchedHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#addToWatchedHandler);
  };

  setAddToFavoriteHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#addToFavoriteHandler);
  };

  #openPopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.openPopupClick();
  };


  #addToWatchlistHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.watchlistClick();
  };

  #addToWatchedHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.watchedClick();
  };

  #addToFavoriteHandler = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    this._callback.favoriteClick();
  };
}
