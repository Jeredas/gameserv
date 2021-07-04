import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
export class RegForm extends GenericPopup<any> {
  login:InputWrapper;
  password: InputWrapper;
  registerButton: ButtonDefault;
  cancelButton: ButtonDefault;
  popupWrapper: Control;
  avatarLoader: InputWrapper;
  labelAvatar: Control;

  onSelect: (value: any) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.labelAvatar = new Control(this.popupWrapper.node, 'label', '', 'set your avatar');
    this.labelAvatar.node.setAttribute('for', 'avatarloader');
    this.avatarLoader = new InputWrapper(this.labelAvatar.node, '', 'AvatarLoader', 'avatarLoader', 'file');
    this.login = new InputWrapper(this.popupWrapper.node, 'Login', 'Login', 'login');
    this.password = new InputWrapper(this.popupWrapper.node, 'Password', 'Password', 'password');

    this.registerButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'register');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'cancel');

    this.registerButton.onClick = () => {
      this.onSelect('register')
    }

    this.cancelButton.onClick = () => {
      this.onSelect('cancel')
    }
  }

}
