import UserRankView from './view/user-rank-view';
import MainNavView from './view/main-nav-view';
import MoviesPresenter from './presenter/movies-presenter';
import MoviesStaticticsView from './view/movies-statistics-view';
import {render} from './render.js';
import MoviesModel from './model/movies-model';
import {generateMovie, generateComment} from './mock/movie';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const moviesModel = new MoviesModel();
const movies = Array.from({length: 5}, generateMovie);
const comments = Array.from({length: 10}, generateComment);
const moviesPresenter = new MoviesPresenter(siteFooterElement, siteMainElement, moviesModel, movies, comments);

render(new UserRankView(), siteHeaderElement);
render(new MainNavView(), siteMainElement);
render(new MoviesStaticticsView(), siteFooterStatisticsElement);

moviesPresenter.init();
