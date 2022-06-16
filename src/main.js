import MainPresenter from './presenter/main-presenter';
import MoviesModel from './model/movies-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter.js';
import CommentsModel from './model/comments-model';
import MoviesApiService from './movies-api-service';
import CommentsApiService from './comments-api-service';

const AUTHORIZATION = 'Basic ljdfsd7d8fsdjfklsdjfls';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';


const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const filterModel = new FilterModel();
const moviesModel = new MoviesModel(new MoviesApiService(END_POINT, AUTHORIZATION));
const commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION));
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, moviesModel);
const mainPresenter = new MainPresenter(siteFooterElement, siteMainElement, filterModel, moviesModel, commentsModel);

filterPresenter.init();
mainPresenter.init();
moviesModel.init();


