import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const humanizeMovieReleaseYearDate = (date) => dayjs(date).format('YYYY');
const humanizeMovieReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
const humanizeCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

const getTimeFromMins = (mins) => {
  const runtime = dayjs.duration(mins, 'minutes');
  return runtime.hours() !== 0 ? `${runtime.hours()}h ${runtime.minutes()}m` : `${runtime.minutes()}m`;
};

export {humanizeMovieReleaseDate, humanizeMovieReleaseYearDate, humanizeCommentDate, getTimeFromMins};
