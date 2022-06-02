import Observable from '../framework/observable';
import {generateMovie} from '../mock/movie';

export default class MoviesModel extends Observable {
  #movies;

  constructor() {
    super();
    this.#movies = Array.from({length: 27}, generateMovie);
  }

  get movies() {
    return this.#movies;
  }
}
