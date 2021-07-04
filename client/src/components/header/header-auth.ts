import Control from '../utilities/control';
import { IHeaderUser } from '../utilities/interfaces';
import { IHeaderControls } from '../utilities/interfaces';

class HeaderAuth extends Control {
  private signIn: Control;

  private user: Control;

  private userAvatar: Control;

  private userName: Control;

  public onSignIn: () => void = () => {};

  public onUserClick: () => void = () => {};

  private configControls: IHeaderControls;

  constructor(parentNode: HTMLElement, configUser: IHeaderUser, configControls: IHeaderControls) {
    super(parentNode, 'div', configUser.wrapper);
    this.configControls = configControls;
    this.user = new Control(this.node, 'div', configUser.user);
    // this.userAvatar = new Control(this.user.node, 'div', configUser.avatar);
    // this.userAvatar.node.style.backgroundImage = `url(${configUser.defaultAvatar})`;
    this.userName = new Control(this.user.node, 'div', configUser.nickName);
    this.userName.node.textContent = 'NickName';

    this.signIn = new Control(this.node, 'div', configControls.wrapper);
    this.signIn.node.textContent = 'Sign In';
    this.signIn.node.onclick = () => {
      this.onSignIn();
    };

    this.user.node.onclick = () => {
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
    this.signIn.node.classList.add(this.configControls.hidden);
  }

  showElement(): void {
    this.signIn.node.classList.remove(this.configControls.hidden);
  }
}

export default HeaderAuth;
