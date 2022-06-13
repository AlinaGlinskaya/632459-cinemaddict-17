import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateMovie = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer(movie) {
    const adaptedMovie = {
      'id': movie.id,
      'comments': movie.comments,
      'film_info': {
        'title': movie.filmInfo.title,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'total_rating': movie.filmInfo.totalRating,
        'poster': movie.filmInfo.poster,
        'age_rating': movie.filmInfo.ageRating,
        'director': movie.filmInfo.director,
        'writers': movie.filmInfo.writers,
        'actors': movie.filmInfo.actors,
        'release': {
          'date': movie.filmInfo.release.date,
          'release_country': movie.filmInfo.release.releaseCountry
        },
        'runtime': movie.filmInfo.runtime,
        'genre': movie.filmInfo.genre,
        'description': movie.filmInfo.description
      },
      'user_details': {
        'watchlist': movie.userDetails.watchlist,
        'already_watched': movie.userDetails.alreadyWatched,
        'watching_date': movie.userDetails.watchingDate,
        'favorite': movie.userDetails.favorite
      }
    };

    return adaptedMovie;
  }
}
