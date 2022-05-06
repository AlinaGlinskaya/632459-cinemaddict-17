export default class MoviesModel {
  #movies;
  #comments;

  get movies() {
    return this.#movies;
  }

  get comments() {
    return this.#comments;
  }
}
