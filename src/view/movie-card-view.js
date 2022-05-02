import {createElement} from '../render.js';
import {humanizeMovieReleaseYearDate, getTimeFromMins} from '../utils.js';

const createMovieCardTemplate = (movie) => {
  const {title, description, totalRating, poster, runtime, genre} = movie.filmInfo;
  const {date} = movie.filmInfo.release;
  const {watchlist, alreadyWatched, favorite} = movie.userDetails;

  const commentsAmount = movie.comments.length;

  const releaseDate = humanizeMovieReleaseYearDate(date);
  const filmDuration = getTimeFromMins(runtime);

  const activeWatchlistClassname = watchlist ? 'film-card__controls-item--active' : '';
  const activeWatchedClassname = alreadyWatched ? 'film-card__controls-item--active' : '';
  const activeFavoriteClassname = favorite ? 'film-card__controls-item--active' : '';

  return (
    `<article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <span class="film-card__comments">${commentsAmount} comments</span>
    </a>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activeWatchlistClassname}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${activeWatchedClassname}" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${activeFavoriteClassname}" type="button">Mark as favorite</button>
    </div>
  </article>`);
};

export default class MovieCardView {
  constructor(movie) {
    this.movie = movie;
  }

  getTemplate() {
    return createMovieCardTemplate(this.movie);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
