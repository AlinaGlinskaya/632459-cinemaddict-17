import AbstractView from '../framework/view/abstract-view';
import {humanizeMovieReleaseDate, humanizeCommentDate, getTimeFromMins} from '../utils.js';
import {EMOTIONS} from '../const.js';

const FORM_DATA = {
  smile: 'smile',
  commentText: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
};

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
  <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched ${userDetails.alreadyWatched ? activeClass : ''}" id="watched" name="watched">Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite ${userDetails.favorite ? activeClass : ''}" id="favorite" name="favorite">Add to favorites</button>`);

  const filmDetailsControlsTemplate = createMovieDetailsControlsTemplate(movie.userDetails, activeMovieDetailsControlsClassname);

  const commentsAmount = comments.length;

  const movieComments = comments.filter((comment) => movie.comments.includes(comment.id));

  const createCommentsListTemplate = (commentsList) => commentsList.map(({author, comment, date, emotion}) =>
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
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

  const createCommentEmotionsTemplate = (currentSmile) => EMOTIONS.map((emotion) =>
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${currentSmile === emotion ? 'checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`).join('');

  const commentEmotionsTemplate = createCommentEmotionsTemplate(formData.smile);

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
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" value="${formData.commentText}"></textarea>
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

export default class PopupView extends AbstractView {
  #movie = null;
  #comments = null;
  #formData = null;
  #button = null;
  constructor(movie, comments, formData = FORM_DATA) {
    super();
    this.#movie = movie;
    this.#comments = comments;
    this.#formData = formData;
    this.#button = '.film-details__close-btn';
  }

  get template() {
    return createPopupTemplate(this.#movie, this.#comments, this.#formData);
  }

  setClosePopupHandler = (callback) => {
    this._callback.click = callback;

    this.element.querySelector(this.#button).addEventListener('click', this.#closePopupHandler);
  };

  #closePopupHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
