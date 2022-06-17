import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {getRandomInteger} from '../utils/common';
dayjs.extend(duration);
dayjs.extend(relativeTime);

const humanizeMovieReleaseYearDate = (date) => dayjs(date).format('YYYY');
const humanizeMovieReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');
const humanizeCommentDate = (date) => dayjs(date).fromNow();

const getTimeFromMins = (mins) => {
  const runtime = dayjs.duration(mins, 'minutes');
  return runtime.hours() !== 0 ? `${runtime.hours()}h ${runtime.minutes()}m` : `${runtime.minutes()}m`;
};

const getRandomMovies = (movies, amount) => {
  const randomMovies = [];
  while (randomMovies.length < amount) {
    const element = movies[getRandomInteger(0, movies.length - 1)];
    if (!randomMovies.find((el) => el.id === element.id)) {
      randomMovies.push(element);
    }
  }
  return randomMovies;
};

const getRatedMoviesCount = (movies) => movies.filter((movie) => movie.filmInfo.totalRating !== 0).length;

const getCommentedMoviesCount = (movies) => movies.filter((movie) => movie.comments.length !== 0).length;

const sortByDate = (movieA, movieB) => dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));

const sortByRating = (movieA, movieB) => movieB.filmInfo.totalRating - movieA.filmInfo.totalRating;

const sortByCommentsAmount = (movieA, movieB) => movieB.comments.length - movieA.comments.length;

const getWatchedMoviesCount = (movies) => movies.filter((movie) => movie.userDetails.alreadyWatched).length;

export {humanizeMovieReleaseDate, humanizeMovieReleaseYearDate, humanizeCommentDate, getTimeFromMins, sortByDate, sortByRating, sortByCommentsAmount, getRandomMovies, getRatedMoviesCount, getCommentedMoviesCount, getWatchedMoviesCount};
