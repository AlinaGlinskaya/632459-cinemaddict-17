import AbstractView from '../framework/view/abstract-view';

const createButtonShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ButtonShowMoreView extends AbstractView {
  get template() {
    return createButtonShowMoreTemplate();
  }

  setShowMoviesClickHandler = (callback) => {
    this._callback.showMoviesClick = callback;

    this.element.addEventListener('click', this.#showMoviesClickHandler);
  };

  #showMoviesClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMoviesClick();
  };
}
