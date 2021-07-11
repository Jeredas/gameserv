import Control from '../utilities/control';
import stylePopup from '../popupService/popupService.module.css'

class GenericPopup<type> extends Control {
  protected popupWrapper: Control;

  onSelect: (value: type) => void;

  constructor(parentNode: HTMLElement, params?: any) {
    super(parentNode, 'div', stylePopup.popup_blackout);
    this.popupWrapper = new Control(this.node, 'div', stylePopup.popup_wrapper);
  }

  destroy() {
    this.node.remove();
  }
}

export default GenericPopup;