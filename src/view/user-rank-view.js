import AbstractView from '../framework/view/abstract-view';
import {getUserRank} from '../utils/movie';
import {getWatchedMoviesCount} from '../utils/movie';

const createUserRankNameTemplate = (movies) => {
  const watchedMoviesCount = getWatchedMoviesCount(movies);
  const userRank = getUserRank(watchedMoviesCount);
  return `<p class="profile__rating">${userRank}</p>`;
};

const createUserRankTemplate = (watchedMovies) => {
  const userRankNameTemplate = createUserRankNameTemplate(watchedMovies);

  return `<section class="header__profile profile">
      ${userRankNameTemplate}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createUserRankTemplate(this.#movies);
  }

  isMoviesWatched() {
    return getWatchedMoviesCount(this.#movies) !== 0;
  }
}
