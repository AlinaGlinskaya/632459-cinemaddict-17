import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class CommentsApiService extends ApiService {
  getComments(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then(ApiService.parseResponse);
  }
}
