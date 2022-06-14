import Observable from '../framework/observable';

export default class CommentsModel extends Observable {
  #comments = [];
  #commentsApiService = null;

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get comments() {
    return this.#comments;
  }

  init = async (movieId) => {
    try {
      const comments = await this.#commentsApiService.getComments(movieId);
      this.#comments = comments;
    } catch(err) {
      this.#comments = [];
    }
  };

  addComment = async (updateType, updatedMovie, updatedComment) => {
    try {
      const newComment = await this.#commentsApiService.addComment(updatedMovie, updatedComment);
      this.#comments = [
        newComment,
        ...this.#comments,
      ];

      this._notify(updateType, updatedMovie);

    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, updatedMovie, updatedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedComment);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(updatedComment);

      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      this._notify(updateType, updatedMovie);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
