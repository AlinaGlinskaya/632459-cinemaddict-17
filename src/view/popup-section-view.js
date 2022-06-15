import AbstractView from '../framework/view/abstract-view';

const createPopupSectionTemplate = () => '<section class="film-details"></section>';

export default class PopupSectionView extends AbstractView {
  get template() {
    return createPopupSectionTemplate();
  }
}
