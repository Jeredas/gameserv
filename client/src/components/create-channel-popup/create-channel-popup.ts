import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import chatStyles from '../chatPage/chatPage.module.css';
import popupStyles from '../popupService/popupService.module.css';

export const gameModePopup = [ 'oneScreen' , 'network', 'bot'];
export const gameName = [ 'One screen' , 'Network', 'Bot'];

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

    this.nameChannel = new InputWrapper(this.popupWrapper.node, 'Name channel', () => null, 'Enter the channel name', 'nameChannel', 'text');
    const wrapperSettingsChannel = new Control(this.popupWrapper.node, 'div', popupStyles.settings_channel_wrapper);
    const titleSettings = new Control(wrapperSettingsChannel.node, 'div', popupStyles.settings_title, 'Сhoose a game type:');
    gameModePopup.forEach((radioBtn, index) => {
      const radio = new InputWrapper(wrapperSettingsChannel.node, '', () => null, '', radioBtn, 'radio',);
      const label =  new Control(radio.node, 'label', '', gameName[index]);
      (radio.field.node as HTMLInputElement).name = 'inputRadio';
      (radio.field.node as HTMLInputElement).value = radioBtn;
      label.node.setAttribute('for', `${radioBtn}`)
      radio.onValidate = null;
    });
    this.createButton = new ButtonDefault(this.popupWrapper.node, popupStyles.settings_button, 'Create');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, popupStyles.settings_button, 'Cancel')
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