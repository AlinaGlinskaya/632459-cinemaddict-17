import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeMovieReleaseYearDate = (date) => dayjs(date).format('YYYY');
const humanizeMovieReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');

const getTimeFromMins = (mins) => {
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;
  return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
};

export {getRandomInteger, humanizeMovieReleaseDate, humanizeMovieReleaseYearDate, getTimeFromMins};
