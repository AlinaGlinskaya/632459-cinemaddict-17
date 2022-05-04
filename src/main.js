import UserRankView from './view/user-rank-view';
import MainNavView from './view/main-nav-view';
import MoviesPresenter from './presenter/movies-presenter';
import MoviesStaticticsView from './view/movies-statistics-view';
import {render} from './render.js';
import MoviesModel from './model/movies-model';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const moviesModel = new MoviesModel();
const moviesPresenter = new MoviesPresenter(siteFooterElement, siteMainElement, moviesModel);


render(new UserRankView(), siteHeaderElement);
render(new MainNavView(), siteMainElement);
render(new MoviesStaticticsView(), siteFooterStatisticsElement);

moviesPresenter.init();
