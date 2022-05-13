import AbstractView from '../framework/view/abstract-view';

const createButtonShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ButtonShowMoreView extends AbstractView {
  get template() {
    return createButtonShowMoreTemplate();
  }

  setShowMoviesHandler = (callback) => {
    this._callback.click = callback;

    this.element.addEventListener('click', this.#showMoviesHandler);
  };

  #showMoviesHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}
