import Control from '../utilities/control';
import configHeader from '../utilities/config-header';
import HeaderAuth from './header-auth';
import NavItem from './nav-item';
import './header.css';

export class Navigation extends Control {
  private navContainer: Control;

  private navItems: Array<NavItem> = [];

  private userBlock: HeaderAuth;

  public onSignIn: () => void = () => {};
  public onUserClick: () => void = () => {};

  constructor(parentNode: HTMLElement | null = null) {
    super(parentNode, 'div', configHeader.wrapper);

    const logo = new Control(this.node, 'div', configHeader.logo.logo);
    logo.node.style.backgroundImage = `url()`;
    this.navContainer = new Control(this.node, 'div', configHeader.nav.container);
    this.userBlock = new HeaderAuth(this.node, configHeader.user, configHeader.controls);

    this.userBlock.onSignIn = () => {
      this.onSignIn();
    };

    this.userBlock.onUserClick = () => {
      this.onUserClick();
    };
  }

  addLink(text: string, hash: string): void {
    const navItem = new NavItem(this.navContainer.node, text, hash);
    this.navItems.push(navItem);
  }

}
