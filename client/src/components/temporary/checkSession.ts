import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import stylePopup from '../popupService/popupService.module.css';
import Control from '../utilities/control';

class CheckSession extends GenericPopup<boolean> {
  ButtonYes: ButtonDefault;
  ButtonNo:ButtonDefault;
  popupWrapper: Control;
  // onShowAbout: () => void;
  // onShowChat: () => void;

  onSelect: (value: boolean) => void;

  constructor(parentNode:HTMLElement) {
    super(parentNode);
    const title = new Control(this.popupWrapper.node, 'div', '', 'session exists?');
    this.ButtonYes = new ButtonDefault(this.popupWrapper.node,stylePopup.popup_default_button, 'yes');
    this.ButtonNo = new ButtonDefault(this.popupWrapper.node,stylePopup.popup_default_button, 'no');

    this.ButtonYes.onClick = () => {
      this.onSelect(true)
    }
    this.ButtonNo.onClick = () => {
      console.log('show abot page with sign in button');
      this.onSelect(false)


    }
  }
} 

export default CheckSession;