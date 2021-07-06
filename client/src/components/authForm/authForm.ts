import { AuthModel } from './../authModel/authModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import { IAuthData } from '../utilities/interfaces';

export class AuthForm extends GenericPopup<any> {
  login: InputWrapper;
  password: InputWrapper;
  loginButton: ButtonDefault;
  cancelButton: ButtonDefault;
  popupWrapper: Control;
  model:AuthModel;
  onSelect: (value: any) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.model = new AuthModel();
    //TODO: Добавить валидацию в инпуты(после)
    this.login = new InputWrapper(this.popupWrapper.node, 'Login', async () => {
      console.log(this.getData().login)
      const res = await this.model.authValidation(this.getData());
      if(res==='ok'){
          return null
      } else {
        return 'Not Found'
      }
    }, 'Login', 'login');
    this.password = new InputWrapper(this.popupWrapper.node, 'Password',async()=>{return null}, 'Password', 'password');

    this.loginButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'log in');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'cancel');

    this.loginButton.onClick = async () => {
     // TODO:Авторизовать юзера, получить имя и автар и передать в хэдер
      
      const res = await this.model.authValidation(this.getData());
      if (res === 'ok') {
        this.model.sendAuthData(this.getData());
        this.onSelect('login');
      } else {
         console.log('User not found') }
    this.model.sendAuthData(this.getData())
  }

    this.cancelButton.onClick =  () => {
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
