import {FILTER_TYPES} from '../const';

const filter = {
  [FILTER_TYPES.ALL]: () => true,
  [FILTER_TYPES.WATCHLIST]: (movie) => movie.userDetails.watchlist,
  [FILTER_TYPES.HISTORY]: (movie) => movie.userDetails.alreadyWatched,
  [FILTER_TYPES.FAVORITE]: (movie) => movie.userDetails.favorite
};

export {filter};
