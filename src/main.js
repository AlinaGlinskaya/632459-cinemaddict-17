import UserRankView from './view/user-rank-view';
import MainNavView from './view/main-nav-view';
import MoviesPresenter from './presenter/movies-presenter';
import MoviesStaticticsView from './view/movies-statistics-view';
import PopupView from './view/popup-veiw';
import {RenderPosition} from './render.js';
import {render} from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const moviesPresenter = new MoviesPresenter();

render(new UserRankView(), siteHeaderElement);
render(new MainNavView(), siteMainElement);
render(new MoviesStaticticsView(), siteFooterStatisticsElement);
render(new PopupView(), siteFooterElement, RenderPosition.AFTEREND);

moviesPresenter.init(siteMainElement);
