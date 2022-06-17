import {FilterType} from '../const';

const Filter = {
  [FilterType.ALL]: () => true,
  [FilterType.WATCHLIST]: (movie) => movie.userDetails.watchlist,
  [FilterType.HISTORY]: (movie) => movie.userDetails.alreadyWatched,
  [FilterType.FAVORITE]: (movie) => movie.userDetails.favorite
};

export {Filter};
