import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import Control from '../utilities/control';

class RegisterCheck extends GenericPopup<boolean> {
  popupWrapper: Control;
  ButtonYes: ButtonDefault;
  ButtonNo: ButtonDefault
  onSelect: (value: boolean) => void;
  constructor(parentNode:HTMLElement) {
    super(parentNode);

    const title =  new Control(this.popupWrapper.node, 'div', 'title_checked_register', 'Are you already registered?');
    this.ButtonYes = new ButtonDefault(this.popupWrapper.node,'popup_default_button', 'yes');
    this.ButtonNo = new ButtonDefault(this.popupWrapper.node,'popup_default_button', 'no');

    this.ButtonYes.onClick = () => {
      this.onSelect(true);
    }

    this.ButtonNo.onClick = () => {
      this.onSelect(false);
    }
  }
}

export default RegisterCheck;