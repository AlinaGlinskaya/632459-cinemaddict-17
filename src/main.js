import UserRankView from './view/user-rank-view';
import MainNavView from './view/main-nav-view';
import MainPresenter from './presenter/main-presenter';
import MoviesStaticticsView from './view/movies-statistics-view';
import {render} from './framework/render';
import MoviesModel from './model/movies-model';
import {generateMovie, generateComment} from './mock/movie';
import {generateFilter} from './mock/filter';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const moviesModel = new MoviesModel();
const movies = Array.from({length: 27}, generateMovie);
const comments = Array.from({length: 10}, generateComment);
const filters = generateFilter(movies);
const mainPresenter = new MainPresenter(siteFooterElement, siteMainElement, moviesModel, movies, comments);

render(new UserRankView(), siteHeaderElement);
render(new MainNavView(filters), siteMainElement);
render(new MoviesStaticticsView(), siteFooterStatisticsElement);

mainPresenter.init();

