const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite'
};

const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

const UserRank = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff'
};

const UserHistory = {
  NOVICE: 1,
  FAN: 11,
  MOVIE_BUFF: 21
};

const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

export {EMOTIONS, FilterType, SortType, UserAction, UpdateType, UserRank, UserHistory};
