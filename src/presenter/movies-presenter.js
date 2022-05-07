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

const body = document.querySelector('body');

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
    render(new SortView(), this.#moviesContainer);
    render(this.moviesComponent, this.#moviesContainer);
    render(this.moviesList, this.moviesComponent.element);
    render(this.moviesListContainer, this.moviesList.element);
    render(new ButtonShowMoreView(), this.moviesList.element);
    render(this.moviesExtraListRated, this.moviesComponent.element);
    render(this.moviesListContainerRated, this.moviesExtraListRated.element);
    render(this.moviesExtraListCommented, this.moviesComponent.element);
    render(this.moviesListContainerCommented, this.moviesExtraListCommented.element);

    const movies = [...this.#movies];
    const comments = [...this.#comments];

    for (const movie of movies) {
      this.#renderMovie(movie, comments, this.moviesListContainer);
    }

    for (const movie of movies.slice(0,2)) {
      this.#renderMovie(movie, comments, this.moviesListContainerRated);
    }

    for (const movie of movies.slice(3,5)) {
      this.#renderMovie(movie, comments, this.moviesListContainerCommented);
    }

  }

  #renderMovie(movie, comments, container) {
    const movieCardComponent = new MovieCardView(movie);
    const popup = new PopupView(movie, comments);

    const closePopup = () => {
      body.querySelector('.film-details').remove();
      body.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        closePopup();
      }
      document.removeEventListener('keydown', onEscKeyDown);
    };

    const openPopup = () => {
      render(popup, this.#popupContainer, RenderPosition.AFTEREND);
      body.classList.add('hide-overflow');
      document.addEventListener('keydown', onEscKeyDown);
    };

    movieCardComponent.element.addEventListener('click', () => {
      if (document.body.querySelector('.film-details')) {
        closePopup();
      }
      openPopup();
    });

    popup.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
    });
    render(movieCardComponent, container.element);
  }
}
