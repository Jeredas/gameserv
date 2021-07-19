import { AuthModel } from '../../authModel/authModel';
import ButtonDefault from '../../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../../inputWrapper/inputWrapper';
import Control from '../../utilities/control';
import { IAuthData, IUserAuth } from '../../utilities/interfaces';
import popupStyles from '../popupService/popupService.module.css';

export class AuthForm extends GenericPopup<any> {
  login: InputWrapper;
  password: InputWrapper;
  loginButton: ButtonDefault;
  cancelButton: ButtonDefault;
  popupWrapper: Control;
  model: AuthModel;
  onSelect: (value: any) => void;
  onLogIn: (param: IUserAuth) => void = () => { };

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.model = new AuthModel();
    this.model.onLogIn.add((data) => {
      this.onSelect({status:'login',data:data});
    });
    this.popupWrapper.node.classList.add(popupStyles.wrapper_auth_main);
    const wrapperInputs = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_auth_sub);
    this.login = new InputWrapper(wrapperInputs.node, 'Login', async () => {
      const res = await this.model.authValidation(this.getData());
      if (res === 'ok') {
        return null;
      } else {
        return 'Not Found';
      }
    }, 'Login', 'login');
    this.password = new InputWrapper(wrapperInputs.node, 'Password', async () => { return null }, 'Password', 'password','password');
    const wrapperButtons = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_btns);
    this.loginButton = new ButtonDefault(wrapperButtons.node, popupStyles.settings_button, 'Log in');
    this.cancelButton = new ButtonDefault(wrapperButtons.node, popupStyles.settings_button, 'Cancel');
    this.loginButton.onClick = async () => {
      const res = await this.model.authValidation(this.getData());
      if (res === 'ok') {
        this.model.sendAuthData(this.getData()).then((res) => {
        });

      } else {
        console.log('User not found or wrong password')
      }
    }

    this.cancelButton.onClick = () => {
      this.onSelect('cancel');

    }
  }

  getData(): IAuthData {
    const obj: IAuthData = {
      login: this.login.getValue(),
      password: this.password.getValue(),
    };
    return obj;
  }
}
