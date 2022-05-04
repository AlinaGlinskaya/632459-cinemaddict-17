import {generateComment, generateMovie} from '../mock/movie';

export default class MoviesModel {
  getMovies = () => this.movies;
  getComments = () => this.comments;

  setMovies = () => Array.from({length: 5}, generateMovie);
  setComments = () => Array.from({length: 10}, generateComment);
}
