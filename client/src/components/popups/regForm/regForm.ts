import { IInputState, IUserData } from '../../utilities/interfaces';
import { AuthModel } from '../../authModel/authModel';
import ButtonDefault from '../../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../../inputWrapper/inputWrapper';
import Control from '../../utilities/control';
import { IAuthData } from '../../utilities/interfaces';
import getFormattedImgDataLink from '../../utilities/imgToDatalink';
import popupStyles from '../popupService/popupService.module.css';
import defaultAvatar from '../../../assets/select-game-popup/avat-def.png';

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
    this.popupWrapper.node.classList.add(popupStyles.wrapper_reg_popup)
    this.model = new AuthModel();
    this.imgSrc = '';
    const wrapperInputs = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_inputs_reg);
    this.labelAvatar = new Control(this.popupWrapper.node, 'label', popupStyles.label_avatar);
    this.labelAvatar.node.style.backgroundImage = `url(${defaultAvatar})`;
    this.labelAvatar.node.setAttribute('for', 'avatarLoader');
    this.avatarLoader = new InputWrapper(this.labelAvatar.node, '', async () => { return null }, 'AvatarLoader', 'avatarLoader', 'file');
    this.avatarLoader.error.destroy();
    this.avatarLoader.caption.destroy();
    this.login = new InputWrapper(wrapperInputs.node, 'Login', async () => {
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
    this.password = new InputWrapper(wrapperInputs.node, 'Password', async () => {
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
    }, 'Password', 'password','password');
    const tooltip = new Control(wrapperInputs.node, 'div', popupStyles.tooltip);
    tooltip.node.textContent = `Password should have minimum eight characters, at least one uppercase letter, one
    lowercase letter and one number`
    const wrapperButtons = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_btns);
    this.registerButton = new ButtonDefault(wrapperButtons.node, popupStyles.settings_button, 'Register');
    this.cancelButton = new ButtonDefault(wrapperButtons.node, popupStyles.settings_button, 'Cancel');

    this.registerButton.onClick = () => {
      this.onSelect('register');
      this.model.regValidation(this.getData()).then(async (res) => {
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
    
    this.avatarLoader.field.node.onchange = async () =>{
      if ((this.avatarLoader.field.node as HTMLInputElement).files != null) {
        const fileBlob = (this.avatarLoader.field.node as HTMLInputElement).files[0];
        getFormattedImgDataLink(200, fileBlob).then((data : string) => {
          const img = new Image();
          img.src = data;
          this.imgSrc = data;
          img.classList.add('avatar_img');
          this.labelAvatar.node.style.backgroundImage = `url(${data})`;
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
