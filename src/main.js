import UserRankView from './view/user-rank-view';
import MainPresenter from './presenter/main-presenter';
import MoviesStaticticsView from './view/movies-statistics-view';
import {render} from './framework/render';
import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter.js';
import CommentsModel from './model/comments-model';
import MoviesApiService from './movies-api-service';

const AUTHORIZATION = 'Basic dfj434jkjk342342';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');
const filterModel = new FilterModel();
const moviesModel = new MoviesModel(new MoviesApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const mainPresenter = new MainPresenter(siteFooterElement, siteMainElement, filterModel, moviesModel, commentsModel);

render(new UserRankView(), siteHeaderElement);
render(new MoviesStaticticsView(), siteFooterStatisticsElement);

filterPresenter.init();
mainPresenter.init();
moviesModel.init();

