import {filter} from '../utils/filter';

export const generateFilter = (movies) => Object.entries(filter).map(
  ([filterName, isMatch]) => ({
    name: filterName,
    count: movies.filter(isMatch).length
  }),
);

