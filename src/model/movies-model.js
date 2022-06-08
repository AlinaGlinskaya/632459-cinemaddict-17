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

  updateMovie = (updateType, updateMovie) => {
    const index = this.#movies.findIndex((movie) => movie.id === updateMovie.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      updateMovie,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, updateMovie);
  };

}
