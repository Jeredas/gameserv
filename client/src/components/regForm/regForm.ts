import { IInputState, IUserData } from './../utilities/interfaces';
import { AuthModel } from './../authModel/authModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import { IAuthData } from '../utilities/interfaces';
import getFormattedImgDataLink from '../utilities/imgToDatalink';
export class RegForm extends GenericPopup<any> {
  login: InputWrapper;
  password: InputWrapper;
  registerButton: ButtonDefault;
  cancelButton: ButtonDefault;
  popupWrapper: Control;
  avatarLoader: InputWrapper;
  labelAvatar: Control;
  model: AuthModel
  state: IInputState
  onSelect: (value: any) => void;
  imgSrc: string;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.model = new AuthModel();
    this.labelAvatar = new Control(this.popupWrapper.node, 'label', '', 'set your avatar');
    this.labelAvatar.node.setAttribute('for', 'avatarloader');
    this.avatarLoader = new InputWrapper(this.labelAvatar.node, '', async () => { return null }, 'AvatarLoader', 'avatarLoader', 'file');
    this.login = new InputWrapper(this.popupWrapper.node, 'Login', async () => {
      const res = await this.model.regValidation(this.getData());
      if (res === 'ok') {
        this.state = { ...this.state, name: true }
        if (this.state.name && this.state.pass) {
          this.registerButton.buttonEnable();
        } else {
          this.registerButton.buttonDisable();
        }
        return null
      } else {
        this.state = { ...this.state, name: false };
        this.registerButton.buttonDisable();
        return 'Wrong name or user already exists';
      }
    }, 'Login', 'login');
    this.password = new InputWrapper(this.popupWrapper.node, 'Password', async () => {
      const res = await this.model.passwordValidation(this.getData());
      // return res === 'ok' ? null : 'Invalid password';
      if (res === 'ok') {
        this.state = { ...this.state, pass: true }
        if (this.state.name && this.state.pass) {
          this.registerButton.buttonEnable();
        } else {
          this.registerButton.buttonDisable();
        }
        return null
      } else {
        this.state = { ...this.state, pass: false }
        this.registerButton.buttonDisable();
        return 'Invalid password';
      }
    }, 'Password', 'password');

    this.registerButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'register');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'cancel');

    this.registerButton.onClick = () => {
      this.onSelect('register');
      this.model.regValidation(this.getData()).then(async (res) => {
        console.log(res);
        if (res == 'ok') {
          const res = await this.model.passwordValidation(this.getData());
          res === 'ok' ? this.model.registerUser(this.getAuthData()) : console.log('wrong');
        } else {
         alert('Not valid or this name already exists')
        }
      })
    }

    this.cancelButton.onClick = () => {
      this.onSelect('cancel');
    };
    
    this.avatarLoader.field.node.onchange = () =>{
      if ((this.avatarLoader.field.node as HTMLInputElement).files != null) {
        const fileBlob = (this.avatarLoader.field.node as HTMLInputElement).files[0];
        getFormattedImgDataLink(200, fileBlob).then((data : string) => {
          const img = new Image();
          img.src = data;
          this.imgSrc = data;
          img.classList.add('avatar_img');
          this.avatarLoader.node.style.backgroundImage = `url(${data})`;
        });
      }
    };
  }
  getData(): IAuthData {
    const obj: IAuthData = {
      login: this.login.getValue(),
      password: this.password.getValue(),
    };
    return obj;
  }
  getAuthData(): IUserData {
    const obj: IUserData = {
      login: this.login.getValue(),
      password: this.password.getValue(),
      avatar: this.imgSrc,
      name: this.login.getValue()
    };
    return obj;
  }
}
