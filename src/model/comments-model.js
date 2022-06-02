import Observable from '../framework/observable';
import {generateComment} from '../mock/movie';

export default class CommentsModel extends Observable {
  #comments;

  constructor() {
    super();
    this.#comments = Array.from({length: 10}, generateComment);
  }

  get comments() {
    return this.#comments;
  }
}
