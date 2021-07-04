import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';

class SettingsChannel extends GenericPopup<any> {
  nameChannel:InputWrapper;
  oneScreen:InputWrapper;
  network:InputWrapper;
  bot: InputWrapper;
  popupWrapper: Control;
  onSelect: (value: any) => void;
  constructor(parentNode: HTMLElement) {
    super(parentNode);

    this.nameChannel = new InputWrapper(this.popupWrapper.node, 'Name channel', 'Name channel', 'nameChannel');

    // this.oneScreen = new InputWrapper(this.popupWrapper.node, 'Name channel', 'Name channel', 'nameChannel', 'radio');
    // this.network = new InputWrapper(this.popupWrapper.node, 'Name channel', 'Name channel', 'nameChannel', 'radio');
    // this.bot = new InputWrapper(this.popupWrapper.node, 'Name channel', 'Name channel', 'nameChannel', 'radio');
    
  }
}

export default SettingsChannel;