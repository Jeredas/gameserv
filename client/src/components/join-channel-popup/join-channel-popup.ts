import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import chatStyles from '../chatPage/chatPage.module.css';

class JoinChannelPopup extends GenericPopup<any> {
  popupWrapper: Control;

  searchField: InputWrapper;

  joinBtn: ButtonDefault;

  cancelBtn: ButtonDefault;

  onSelect: (value: any) => void;

  constructor(parentNode:HTMLElement) {
    super(parentNode);
    this.searchField = new InputWrapper(this.popupWrapper.node, 'Enter the name of the channel you want to join', () => null, 'Name Channel');

    this.joinBtn = new ButtonDefault(this.popupWrapper.node, chatStyles.default_button, 'join channel');
    this.cancelBtn = new ButtonDefault(this.popupWrapper.node, chatStyles.default_button, 'cancel');

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