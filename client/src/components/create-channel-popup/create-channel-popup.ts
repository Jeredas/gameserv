import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import chatStyles from '../chatPage/chatPage.module.css';

export const gameModePopup = [ 'oneScreen' , 'network', 'bot'];

class CreateChannelPopup extends GenericPopup<any> {
  nameChannel:InputWrapper;

  oneScreen:InputWrapper;

  network:InputWrapper;

  bot: InputWrapper;

  popupWrapper: Control;

  createButton: ButtonDefault;

  cancelButton: ButtonDefault;

  onSelect: (value: any) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);

    this.nameChannel = new InputWrapper(this.popupWrapper.node, 'Name channel', () => null, 'Name channel', 'nameChannel');
    gameModePopup.forEach((radioBtn) => {
      const radio = new InputWrapper(this.popupWrapper.node, '', () => null, '', radioBtn, 'radio');
      const label =  new Control(radio.node, 'label', '', radioBtn);
      (radio.field.node as HTMLInputElement).name = 'inputRadio';
      (radio.field.node as HTMLInputElement).value = radioBtn;
      label.node.setAttribute('for', `${radioBtn}`)
      radio.onValidate = null;
    });
    this.createButton = new ButtonDefault(this.popupWrapper.node, chatStyles.default_button, 'create');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, chatStyles.default_button, 'cancel');

    this.cancelButton.onClick = () => {
      this.destroy();
    }

    this.createButton.onClick = () => {
      console.log('create Channel');
      this.onSelect(this.nameChannel.getValue());
    }
  }
}

export default CreateChannelPopup;