import MoviesView from '../view/movies-view';
import SortView from '../view/sort-view';
import MoviesList from '../view/movies-list-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import MoviesListContainerView from '../view/movies-list-container-view';
import MovieCardView from '../view/movie-card-view';
import MoviesExtraView from '../view/movies-extra-view';
import {render} from '../framework/render';
import PopupView from '../view/popup-veiw';
import {RenderPosition} from '../render.js';
import MoviesListTitleView from '../view/movies-list-title-view';
import MoviesListEmptyView from '../view/movies-list-empty-view';

const MOVIES_COUNT_PER_STEP = 5;
const body = document.querySelector('body');

export default class MainPresenter {
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

  #moviesComponent = new MoviesView();
  #moviesList = new MoviesList();
  #moviesListContainer = new MoviesListContainerView();
  #moviesExtraListRated = new MoviesExtraView('Top rated');
  #moviesExtraListCommented = new MoviesExtraView('Most commented');
  #moviesListContainerRated = new MoviesListContainerView();
  #moviesListContainerCommented = new MoviesListContainerView();
  #buttonShowMoreComponent = new ButtonShowMoreView();
  #renderedMoviesCount = MOVIES_COUNT_PER_STEP;

  init() {
    const movies = [...this.#movies];
    const comments = [...this.#comments];

    this.#renderMain(movies, comments);
  }

  #renderSorting() {
    render(new SortView(), this.#moviesContainer);
  }

  #renderMainMoviesList(movies, comments) {
    render(this.#moviesComponent, this.#moviesContainer);
    render(this.#moviesList, this.#moviesComponent.element);

    if (movies.length === 0) {
      render(new MoviesListEmptyView, this.#moviesList.element);
      return;
    }

    render(new MoviesListTitleView(), this.#moviesList.element);
    render(this.#moviesListContainer, this.#moviesList.element);

    if (movies.length > MOVIES_COUNT_PER_STEP) {
      render(this.#buttonShowMoreComponent, this.#moviesList.element);

      this.#buttonShowMoreComponent.setShowMoviesHandler(this.#onClickShowMore);
    }

    for (let i = 0; i < Math.min(movies.length, MOVIES_COUNT_PER_STEP); i++) {
      this.#renderMovie(movies[i], comments, this.#moviesListContainer);
    }
  }

  #renderRated(movies, comments) {
    render(this.#moviesExtraListRated, this.#moviesComponent.element);
    render(this.#moviesListContainerRated, this.#moviesExtraListRated.element);
    for (const movie of movies.slice(0,2)) {
      this.#renderMovie(movie, comments, this.#moviesListContainerRated);
    }
  }

  #renderCommented(movies, comments) {
    render(this.#moviesExtraListCommented, this.#moviesComponent.element);
    render(this.#moviesListContainerCommented, this.#moviesExtraListCommented.element);
    for (const movie of movies.slice(3,5)) {
      this.#renderMovie(movie, comments, this.#moviesListContainerCommented);
    }
  }

  #renderMain (movies, comments) {
    this.#renderSorting();
    this.#renderMainMoviesList(movies, comments);
    this.#renderRated(movies, comments);
    this.#renderCommented(movies, comments);
  }

  #onClickShowMore = () => {
    this.#movies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie, this.#comments, this.#moviesListContainer));

    this.#renderedMoviesCount += MOVIES_COUNT_PER_STEP;

    if (this.#renderedMoviesCount >= this.#movies.length) {
      this.#buttonShowMoreComponent.element.remove();
      this.#buttonShowMoreComponent.removeElement();
    }
  };

  #closePopup(handler) {
    body.querySelector('.film-details').remove();
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', handler);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this.#closePopup(this.#onEscKeyDown);
    }
  };

  #openPopup(popup, handler) {
    render(popup, this.#popupContainer, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', handler);
  }

  #onClickClosePopup = () => {
    this.#closePopup(this.#onEscKeyDown);
  };

  #renderMovie(movie, comments, container) {
    const movieCardComponent = new MovieCardView(movie);
    const popup = new PopupView(movie, comments);

    movieCardComponent.setOpenPopupHandler(() => {
      if (document.body.querySelector('.film-details')) {
        this.#closePopup(this.#onEscKeyDown);
      }
      this.#openPopup(popup, this.#onEscKeyDown);
    });

    popup.setClosePopupHandler(this.#onClickClosePopup);
    render(movieCardComponent, container.element);
  }
}
