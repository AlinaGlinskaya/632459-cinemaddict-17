import {generateMovie} from '../mock/movie';

export default class MoviesModel {
  movies = Array.from({length: 5}, generateMovie);

  getMovies = () => this.movies;
}
