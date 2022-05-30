import AbstractStatefulView  from '../framework/view/abstract-stateful-view';
import {humanizeMovieReleaseDate, humanizeCommentDate, getTimeFromMins} from '../utils/movie';
import {EMOTIONS} from '../const.js';

const createPopupTemplate = (movie, comments, formData) => {
  const {title, alternativeTitle, description, totalRating, poster, runtime, ageRating, director} = movie.filmInfo;
  const {releaseCountry} = movie.filmInfo.release;
  const activeMovieDetailsControlsClassname = 'film-details__control-button--active';

  const ageRatingValue = `${ageRating}+`;
  const filmDuration = getTimeFromMins(runtime);
  const filmReleaseDate = humanizeMovieReleaseDate(movie.filmInfo.release.date);

  const writers = movie.filmInfo.writers;
  const writersList = writers.join(', ');
  const actors = movie.filmInfo.actors;
  const actorsList = actors.join(', ');

  const genresList = movie.filmInfo.genre;
  const createMovieGenresTemplate = () => genresList.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
  const filmGenresTemplate = createMovieGenresTemplate(genresList);

  const createMovieDetailsControlsTemplate = (userDetails, activeClass) => (`<button type="button" class="film-details__control-button film-details__control-button--watchlist ${userDetails.watchlist ? activeClass  : ''}" id="watchlist" name="watchlist">Add to watchlist</button>
  <button type="button" class="film-details__control-button film-details__control-button--watched ${userDetails.alreadyWatched ? activeClass : ''}" id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? activeClass : ''}" id="favorite" name="favorite">Add to favorites</button>`);

  const filmDetailsControlsTemplate = createMovieDetailsControlsTemplate(movie.userDetails, activeMovieDetailsControlsClassname);

  const commentsAmount = comments.length;

  const movieComments = comments.filter((comment) => movie.comments.includes(comment.id));

  const createCommentsListTemplate = (commentsList) => commentsList.map(({author, comment, date, emotion}) =>
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`).join('');

  const commentsListTemplate = createCommentsListTemplate(movieComments);

  const createCommentEmotionsTemplate = (currentEmotion) => EMOTIONS.map((emotion) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${currentEmotion === emotion ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`).join('');

  const commentEmotionsTemplate = createCommentEmotionsTemplate(formData.emotion);

  return (`<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRatingValue}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsList}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${filmReleaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${filmGenresTemplate}
                </td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          ${filmDetailsControlsTemplate}
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsAmount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsListTemplate}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"><img src="images/emoji/${formData.emotion}.png" width="55" height="55" alt="emoji-${formData.emotion}"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${commentEmotionsTemplate}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`);
};

export default class PopupView extends AbstractStatefulView {
  #movie = null;
  #comments = null;
  #button = null;
  #inputs = null;
  #popup = null;
  constructor(movie, comments, formData = {emotion: 'smile'}) {
    super();
    this.#movie = movie;
    this.#comments = comments;
    this.#button = '.film-details__close-btn';
    this._state = PopupView.parseFormToState(formData);
    this.#setInputHandlers();
  }

  get template() {
    return createPopupTemplate(this.#movie, this.#comments, this._state);
  }

  static parseFormToState = (formData) => ({...formData,
    emotion: formData.emotion
  });

  static parseStateTiForm = (state) => {
    const formData = {...state};

    if (!formData.emotion) {
      formData.emotion = 'smile';
    }

    delete formData.emotion;

    return formData;
  };

  _restoreHandlers = () => {
    this.#setInputHandlers();
    this.setClosePopupHandler(this._callback.closeClick);
    this.setAddToWatchlistHandler(this._callback.watchlistClick);
    this.setAddToWatchedHandler(this._callback.watchedClick);
    this.setAddToFavoriteHandler(this._callback.favoriteClick);
  };

  #setInputHandlers() {
    this.#inputs = this.element.querySelectorAll('.film-details__emoji-item');
    for (const input of this.#inputs) {
      input.addEventListener('click', this.#changeCommentEmotionHandler);
    }
  }

  setClosePopupHandler = (callback) => {
    this._callback.closeClick = callback;

    this.element.querySelector(this.#button).addEventListener('click', this.#closePopupHandler);
  };

  #closePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  setAddToWatchlistHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addToWatchlistHandler);
  };

  setAddToWatchedHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#addToWatchedHandler);
  };

  setAddToFavoriteHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#addToFavoriteHandler);
  };

  #addToWatchlistHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #addToWatchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #addToFavoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  #changeCommentEmotionHandler = (evt) => {
    evt.preventDefault();
    this._position = document.querySelector('.film-details').scrollTop;
    this.updateElement({
      emotion: evt.target.value,
    });

    this.#popup = document.querySelector('.film-details');
    this.#popup.scrollTo(0, this._position);
  };
}
