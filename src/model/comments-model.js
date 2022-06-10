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

  addComment = (updateType, updatedMovie, updatedComment) => {
    this.#comments = [
      updatedComment,
      ...this.#comments,
    ];

    this._notify(updateType, updatedMovie);
  };

  deleteComment = (updateType, updatedMovie, updatedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedComment);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];


    this._notify(updateType, updatedMovie);
  };
}
