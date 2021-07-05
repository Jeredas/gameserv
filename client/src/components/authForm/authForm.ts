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
  onSelect: (value: any) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    //TODO: Добавить валидацию в инпуты(после)
    this.login = new InputWrapper(this.popupWrapper.node, 'Login', async()=>{return null}, 'Login', 'login');
    this.password = new InputWrapper(this.popupWrapper.node, 'Password',async()=>{return null}, 'Password', 'password');

    this.loginButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'log in');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'cancel');

    this.loginButton.onClick = () => {
      //TODO:Авторизовать юзера, получить имя и автар и передать в хэдер
      this.onSelect('login')
    }

    this.cancelButton.onClick = () => {
      this.onSelect('cancel')
    }
  }
}
