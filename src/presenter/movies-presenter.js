import MoviesView from '../view/movies-view';
import SortView from '../view/sort-view';
import MoviesList from '../view/movies-list';
import ButtonShowMoreView from '../view/button-show-more-view';
import MoviesListContainerView from '../view/movies-list-container-view';
import MovieCardView from '../view/movie-card-view';
import MoviesExtraView from '../view/movies-extra-view';
import {render} from '../render.js';
import PopupView from '../view/popup-veiw';
import {RenderPosition} from '../render.js';

export default class MoviesPresenter {
  #popupContainer;
  #moviesContainer;
  #moviesModel;
  #movies;
  #comments;
  constructor(popupContainer, moviesContainer, moviesModel, movies, comments) {
    this.#popupContainer = popupContainer;
    this.#moviesContainer = moviesContainer;
    this.#moviesModel = moviesModel;
    this.#movies = movies;
    this.#comments = comments;
  }

  moviesComponent = new MoviesView();
  moviesList = new MoviesList();
  moviesListContainer = new MoviesListContainerView();
  moviesExtraListRated = new MoviesExtraView('Top rated');
  moviesExtraListCommented = new MoviesExtraView('Most commented');
  moviesListContainerRated = new MoviesListContainerView();
  moviesListContainerCommented = new MoviesListContainerView();
  popupView = new PopupView();

  init() {
    const movies = [...this.#movies];
    const comments = [...this.#comments];

    render(new SortView(), this.#moviesContainer);
    render(this.moviesComponent, this.#moviesContainer);
    render(this.moviesList, this.moviesComponent.element);
    render(this.moviesListContainer, this.moviesList.element);

    for (const movie of movies) {
      render(new MovieCardView(movie), this.moviesListContainer.element);
    }

    render(new ButtonShowMoreView(), this.moviesList.element);

    render(this.moviesExtraListRated, this.moviesComponent.element);
    render(this.moviesListContainerRated, this.moviesExtraListRated.element);
    for (const movie of movies.slice(0,2)) {
      render(new MovieCardView(movie), this.moviesListContainerRated.element);
    }

    render(this.moviesExtraListCommented, this.moviesComponent.element);
    render(this.moviesListContainerCommented, this.moviesExtraListCommented.element);
    for (const movie of movies.slice(3,5)) {
      render(new MovieCardView(movie), this.moviesListContainerCommented.element);
    }

    render(new PopupView(movies[0], comments), this.#popupContainer, RenderPosition.AFTEREND);

  }
}
