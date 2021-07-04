//import { Component } from 'utilities/Component';
// import { GameSelect } from "../chat/game-select";
//import { GenericPopup } from '../chat/genericPopup';
import Control from '../utilities/control';
import popupStyle from './popupService.css';

//console.log(popupStyle);

class PopupService extends Control {
  constructor() {
    super(null, 'div', popupStyle.popup_layer);
  }

  init(parentNode:HTMLElement) {
    parentNode.append(this.node);
  }

  showPopup<type>(Popup: any):Promise<type> {
    return new Promise((resolve, reject) => {
      const popup = new Popup(this.node);
      popup.onSelect = (result: type) => {
        resolve(result);
        popup.destroy();
      };
    });
  }
}

export const popupService = new PopupService();
