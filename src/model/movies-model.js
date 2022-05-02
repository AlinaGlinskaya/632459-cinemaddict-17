import {generateComment, generateMovie} from '../mock/movie';

export default class MoviesModel {
  movies = Array.from({length: 5}, generateMovie);
  comments = Array.from({length: 10}, generateComment);

  getMovies = () => this.movies;
  getComments = () => this.comments;
}
