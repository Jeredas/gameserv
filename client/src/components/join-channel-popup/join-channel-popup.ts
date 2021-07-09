import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import popupStyles from '../popupService/popupService.module.css';

class JoinChannelPopup extends GenericPopup<any> {
  popupWrapper: Control;

  searchField: InputWrapper;

  joinBtn: ButtonDefault;

  cancelBtn: ButtonDefault;

  onSelect: (value: any) => void;

  constructor(parentNode:HTMLElement) {
    super(parentNode);
    this.searchField = new InputWrapper(this.popupWrapper.node, 'Enter the name of the channel you want to join', () => null, 'Name Channel', '', 'text');
    this.popupWrapper.node.classList.add(popupStyles.wrapper_join);
    const wrapperBtns = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_btns);
    this.joinBtn = new ButtonDefault(wrapperBtns.node, popupStyles.settings_button, 'Join channel');
    this.cancelBtn = new ButtonDefault(wrapperBtns.node, popupStyles.settings_button, 'Cancel');

    this.joinBtn.onClick = () => {
      console.log('join to the channel');
      this.onSelect(this.searchField.getValue());
    }

    this.cancelBtn.onClick = () => {
      this.destroy();
    }
  }
}

export default JoinChannelPopup;