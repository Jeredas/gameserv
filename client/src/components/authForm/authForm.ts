import { AuthModel } from './../authModel/authModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import { IAuthData, IUserAuth } from '../utilities/interfaces';
import { ConcatenationScope } from 'webpack';
import Signal from '../../socketClient/signal';

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

    this.login = new InputWrapper(this.popupWrapper.node, 'Login', async () => {
      const res = await this.model.authValidation(this.getData());
      if (res === 'ok') {
        return null
      } else {
        return 'Not Found'
      }
    }, 'Login', 'login');
    this.password = new InputWrapper(this.popupWrapper.node, 'Password', async () => { return null }, 'Password', 'password');
    this.loginButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'log in');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'cancel');
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
