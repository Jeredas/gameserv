import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import stylePopup from '../popupService/popupService.css'
import Control from '../utilities/control';

class CheckSession extends GenericPopup {
  ButtonYes: ButtonDefault;
  ButtonNo:ButtonDefault;
  popupWrapper: Control;

  constructor(parentNode:HTMLElement) {
    super(parentNode);
    const title = new Control(this.popupWrapper.node, 'div', '', 'session exists?');
    this.ButtonYes = new ButtonDefault(this.popupWrapper.node,stylePopup.popup_default_button, 'yes');
    this.ButtonNo = new ButtonDefault(this.popupWrapper.node,stylePopup.popup_default_button, 'no');
  }
} 

export default CheckSession;