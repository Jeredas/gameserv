import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';

export class AuthForm extends GenericPopup<any> {
  login: InputWrapper;
  password: InputWrapper;
  loginButton: ButtonDefault;
  cancelButton: ButtonDefault;
  popupWrapper: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.login = new InputWrapper(this.popupWrapper.node, 'Login', 'Login', 'login');
    this.password = new InputWrapper(this.popupWrapper.node, 'Password', 'Password', 'password');

    this.loginButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'register');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'cancel');

    this.loginButton.onClick = () => {

    }

    this.cancelButton.onClick = () => {
      
    }
  }
}
