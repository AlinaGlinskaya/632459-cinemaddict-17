import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {
  getComments(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then(ApiService.parseResponse);
  }

  addComment = async (movie, comment) => {
    const response = await this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (comment) => {
    const response = await this._load({
      url: `comments/${comment}`,
      method: Method.DELETE,
    });

    return response;
  };
}
