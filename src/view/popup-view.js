import AbstractStatefulView  from '../framework/view/abstract-stateful-view';
import {humanizeMovieReleaseDate, humanizeCommentDate, getTimeFromMins} from '../utils/movie';
import {EMOTIONS} from '../const.js';
import he from 'he';

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

  const movieComments = comments.filter((comment) => movie.comments.includes(comment.id));

  const commentsAmount = movieComments.length;

  const createCommentsListTemplate = (commentsList) => commentsList.map(({id, author, comment, date, emotion}) =>
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(date)}</span>
          <button class="film-details__comment-delete" data-id="${id}">Delete</button>
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
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(formData.comment)}</textarea>
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

const defaultState = {comment: '', emotion: 'smile'};

export default class PopupView extends AbstractStatefulView {
  #movie = null;
  #button = null;
  #form = null;
  #comments = null;
  #commentsModel = null;
  constructor(movie, comments, commentsModel) {
    super();
    this.#movie = movie;
    this.#comments = comments;
    this.#button = '.film-details__close-btn';
    this.#commentsModel = commentsModel;
    this._state = {...defaultState};
    this.#setInputHandlers();
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  get template() {
    return createPopupTemplate(this.#movie, this.comments, this._state);
  }

  _restoreHandlers = () => {
    this.#setInputHandlers();
    this.setClosePopupHandler(this._callback.closeClick);
    this.setAddToWatchlistHandler(this._callback.watchlistClick);
    this.setAddToWatchedHandler(this._callback.watchedClick);
    this.setAddToFavoriteHandler(this._callback.favoriteClick);
    this.setDeleteCommentHandlers(this._callback.deleteClick);
    this.setAddCommentHandler(this._callback.addKeydown);
  };

  #setInputHandlers() {
    this.#form = this.element.querySelector('.film-details__inner');
    this.#form.addEventListener('change', this.#changeCommentHandler);
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

  setDeleteCommentHandlers = (callback) => {
    this._callback.deleteClick = callback;
    const buttons = this.element.querySelectorAll('.film-details__comment-delete');
    for (const button of buttons) {
      button.addEventListener('click', this.#deleteCommentHandler);
    }
  };

  setAddCommentHandler = (callback) => {
    this._callback.addKeydown = callback;
    this.#form.addEventListener('keydown', this.#addNewCommentHandler);
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

  #customUpdateElement = (data) => {
    this._position = this.element.scrollTop;
    this.updateElement(data);
    this.element.scrollTo(0, this._position);
  };

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    const commentId = evt.target.dataset.id;
    this._callback.deleteClick(this.#movie, commentId);
    this.#customUpdateElement({comments: this.comments});
  };

  #changeCommentHandler = (evt) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget);
    const commentData = {
      comment: formData.get('comment') || '',
      emotion: formData.get('comment-emoji')
    };
    if (commentData.emotion === this._state.emotion) {
      this._setState(commentData);
    } else {
      this.#customUpdateElement(commentData);
    }
  };

  #addNewCommentHandler = (evt) => {
    if (evt.ctrlKey && evt.keyCode === 13) {
      const comment = {
        id: '2',
        author: 'Author',
        date: new Date(),
        comment: evt.target.value,
        emotion: this._state.emotion
      };
      this._callback.addKeydown(this.#movie, comment);
      this.#customUpdateElement({...defaultState, comments: this.comments});
    }
  };
}
