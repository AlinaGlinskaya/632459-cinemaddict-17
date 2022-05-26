import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: () => true,
  [FilterType.WATCHLIST]: (movie) => movie.userDetails.watchlist,
  [FilterType.HISTORY]: (movie) => movie.userDetails.alreadyWatched,
  [FilterType.FAVORITE]: (movie) => movie.userDetails.favorite
};

export {filter};
