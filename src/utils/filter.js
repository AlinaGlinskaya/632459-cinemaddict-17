import {FILTER_TYPES} from '../const';

const filter = {
  [FILTER_TYPES.WATCHLIST]: (movies) => movies.filter((movie) => movie.userDetails.watchlist),
  [FILTER_TYPES.HISTORY]: (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched),
  [FILTER_TYPES.FAVORITE]: (movies) => movies.filter((movie) => movie.userDetails.favorite)
};

export {filter};
