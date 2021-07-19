import { popupService } from '../popups/popupService/popupService';
import Control from '../utilities/control';
import headerStyles from './header.module.css';
import SettingsUser from '../popups/settingsUser/settingsUser';
import Signal from '../../socketClient/signal';
import defaultAvatar from '../../assets/default-avatar.png';


class HeaderAuth extends Control {

  private user: Control;

  private userAvatar: Control;

  private userName: Control;

  public onSignIn: () => void = () => {};

  public onUserClick: () => void = () => {};
  
  public onLogout : Signal<''> = new Signal();
  private signIn: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', headerStyles.header_auth);
    // this.configControls = configControls;
    this.user = new Control(this.node, 'div', headerStyles.auth_user);
    this.userAvatar = new Control(this.user.node, 'div', headerStyles.auth_avatar);
    this.userAvatar.node.style.backgroundImage = `url(${defaultAvatar})`;
    this.userName = new Control(this.user.node, 'div', headerStyles.auth_nickname);
    this.userName.node.textContent = 'NickName';

    this.signIn = new Control(this.node, 'div', headerStyles.auth_controls);
    this.signIn.node.textContent = 'Sign In';
    this.signIn.node.onclick = () => {
      this.onSignIn();
    };

    this.user.node.onclick = () => {
      // popupService.init(parentNode);
      popupService.showPopup(SettingsUser).then((res)=>{
        if(res==='save') {
          //TODO:Изменить аватар и имя после редактирования
          console.log('Changes saved')
        }  else if (res ==='cancel') {
          console.log('Changes not saved')
        } else if(res === 'logOut'){
          console.log('logOut');
          
          //this.userAvatar.node.classList.add(headerStyles.default_avatar)
          this.onLogout.emit('')
         
        }
      })
      this.onUserClick();
    };
  }

  setAvatar(avatar: string): void {
    if(avatar) {
      this.userAvatar.node.style.backgroundImage = `url(${avatar})`;
    }
  }

  setUserName(name: string): void {
    this.userName.node.textContent = name;
  }

  setHidden() {
    this.user.node.classList.add(headerStyles.default_hidden);
    this.signIn.node.classList.remove(headerStyles.default_hidden);
  }

  removeHidden() {
    this.user.node.classList.remove(headerStyles.default_hidden);
    this.signIn.node.classList.add(headerStyles.default_hidden);
  }

}

export default HeaderAuth;
