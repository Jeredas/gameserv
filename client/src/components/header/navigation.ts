import Control from '../utilities/control';
// import configHeader from '../utilities/config-header';
import HeaderAuth from './header-auth';
import NavItem from './nav-item';
import headerStyles from './header.module.css';
import { IUserAuth } from '../utilities/interfaces';

export class Navigation extends Control {
  private navContainer: Control;

  private navItems: Array<NavItem> = [];

  private userBlock: HeaderAuth;

  // public onLogout: () => void = () => {};
  public onUserClick: () => void = () => {};

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', headerStyles.header_wrapper);

    const logo = new Control(this.node, 'div', headerStyles.header_logo);
    // logo.node.style.backgroundImage = `url()`;
    this.navContainer = new Control(this.node, 'div', headerStyles.header_nav);
    this.userBlock = new HeaderAuth(this.node);

    
    this.userBlock.onUserClick = () => {
      this.onUserClick();
    };
  }

  addLink(text: string, hash: string): void {
    const navItem = new NavItem(this.navContainer.node, text, hash);
    this.navItems.push(navItem);
  }

  setActive(hash: string): void {
    this.navItems.forEach((item) => {
      if (item.getHash() == hash) {
        item.setActive();
      } else {
        item.setInactive();
      }
    });
  }
  setUserData(data: IUserAuth): void {
    console.log(data,'setData');
    this.userBlock.setUserName(data.login);
    this.userBlock.setAvatar(data.avatar);
  }

}
