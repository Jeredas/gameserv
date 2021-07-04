import Control from '../utilities/control';
import stylePopup from '../popupService/popupService.css'

class GenericPopup extends Control {
  popupWrapper: Control;

  // onSelect: (value: type) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', stylePopup.popup_blackout);
    this.popupWrapper = new Control(this.node, 'div', stylePopup.popup_wrapper);
  }

  destroy() {
    this.node.remove();
  }
}

export default GenericPopup;