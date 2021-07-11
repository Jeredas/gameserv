import Control from '../utilities/control';
// import configHeader from '../utilities/config-header';
import HeaderAuth from './header-auth';
import NavItem from './nav-item';
import headerStyles from './header.module.css';
import { IUserAuth } from '../utilities/interfaces';
import Signal from '../../socketClient/signal';

export class Navigation extends Control {
  private navContainer: Control;

  private navItems: Array<NavItem> = [];

  private userBlock: HeaderAuth;
  public onUserClick: () => void = () => {};
  public onLogout : Signal<null> = new Signal();
  private logo: Control;

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', headerStyles.header_wrapper);

    this.logo = new Control(this.node, 'div', headerStyles.header_logo);
    // logo.node.style.backgroundImage = `url()`;
    this.navContainer = new Control(this.node, 'div', headerStyles.header_nav);
    this.userBlock = new HeaderAuth(this.node);

    
    this.userBlock.onUserClick = () => {
      this.onUserClick();
    };
    this.userBlock.onLogout.add(()=>{
      this.onLogout.emit(null)
    })
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
    this.userBlock.setUserName(data.login);
    this.userBlock.setAvatar(data.avatar);
  }
  addConnection(): void {
    this.logo.node.classList.add(headerStyles.connected);
  }

  removeConnection(): void {
    this.logo.node.classList.remove(headerStyles.connected);
  }

  removeLink(hash: string) {
    const navItem = this.navItems.find((item) => item.getHash() === hash);
    this.navItems = this.navItems.filter((item) => item !== navItem);
    navItem.destroy();
  }
}
