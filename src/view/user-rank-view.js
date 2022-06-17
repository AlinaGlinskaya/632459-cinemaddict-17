import AbstractView from '../framework/view/abstract-view';
import {UserRank, UserHistory} from '../const';
import {getMoviesWatchedCount} from '../utils/movie';

const createUserRankNameTemplate = (movies) => {
  const watchedMoviesCount = getMoviesWatchedCount(movies);
  if (watchedMoviesCount >= UserHistory.MOVIE_BUFF) {
    return `<p class="profile__rating">${UserRank.MOVIE_BUFF}</p>`;
  } else if (watchedMoviesCount < UserHistory.MOVIE_BUFF && watchedMoviesCount >= UserHistory.FAN) {
    return `<p class="profile__rating">${UserRank.FAN}</p>`;
  }
  return `<p class="profile__rating">${UserRank.NOVICE}</p>`;
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

  isHistory() {
    return getMoviesWatchedCount(this.#movies) !== 0;
  }
}
