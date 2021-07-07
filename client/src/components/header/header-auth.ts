import { popupService } from '../popupService/popupService';
import Control from '../utilities/control';
import headerStyles from './header.module.css';
import SettingsUser from '../settingsUser/settingsUser';


class HeaderAuth extends Control {
  private signIn: Control;

  private user: Control;

  private userAvatar: Control;

  private userName: Control;

  public onSignIn: () => void = () => {};

  public onUserClick: () => void = () => {};
  
  

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', headerStyles.header_auth);
    // this.configControls = configControls;
    this.user = new Control(this.node, 'div', headerStyles.auth_user);
    this.userAvatar = new Control(this.user.node, 'div', headerStyles.default_avatar);
    // this.userAvatar.node.style.backgroundImage = `url(${configUser.defaultAvatar})`;
    this.userName = new Control(this.user.node, 'div', headerStyles.auth_nickname);
    this.userName.node.textContent = 'NickName';

    // this.signIn = new Control(this.node, 'div', headerStyles.auth_controls);
    // this.signIn.node.textContent = 'Sign In';
    // this.signIn.node.onclick = () => {
    //   this.onSignIn();
    // };

    this.userName.node.onclick = () => {
      popupService.init(parentNode);
      popupService.showPopup(SettingsUser).then((res)=>{
        if(res==='save') {
          //TODO:Изменить аватар и имя после редактирования
          console.log('Changes saved')
        } else {
          console.log('Changes not saved')
        }
      })
      this.onUserClick();
    };
  }

  setAvatar(avatar: string): void {
    this.userAvatar.node.style.backgroundImage = `url(${avatar})`;
  }

  setUserName(name: string): void {
    this.userName.node.textContent = name;
  }

  hideElement(): void {
    this.signIn.node.classList.add(headerStyles.default_hidden);
  }

  showElement(): void {
    this.signIn.node.classList.remove(headerStyles.default_hidden);
  }
}

export default HeaderAuth;
