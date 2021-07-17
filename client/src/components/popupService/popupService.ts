import Control from '../utilities/control';
import popupStyle from './popupService.module.css';

class PopupService extends Control {
  constructor() {
    super(null, 'div', popupStyle.popup_layer);
  }

  init(parentNode:HTMLElement) {
    parentNode.append(this.node);
  }

  showPopup<type>(Popup: any, params?:any):Promise<type> {
    return new Promise((resolve, reject) => {
      const popup = new Popup(this.node, params);
      popup.onSelect = (result: type) => {
        resolve(result);
        popup.destroy();
      };
    });
  }
}

export const popupService = new PopupService();
