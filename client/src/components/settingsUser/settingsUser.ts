import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';

class SettingsUser extends GenericPopup<any> {
  changeAvatar: Control;
  avatarLoaderSettings: InputWrapper;
  name: InputWrapper;
  saveButton: ButtonDefault;
  cancelButton: ButtonDefault;

  onSelect: (value: any) => void;

  constructor(parentNode:HTMLElement) {
    super(parentNode);
    this.changeAvatar = new Control(this.popupWrapper.node, 'label', '', 'set your avatar');
    this.changeAvatar.node.setAttribute('for', 'avatarloader');
    this.avatarLoaderSettings = new InputWrapper(this.changeAvatar.node, '', 'AvatarLoader', 'avatarLoader', 'file');
    this.name = new InputWrapper(this.popupWrapper.node, 'name', 'name', 'name');

    this.saveButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'Save');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'Cancel');
  }
}

export default SettingsUser;