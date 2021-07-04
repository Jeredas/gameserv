import Control from '../utilities/control';
import headerStyles from './header.css';

class NavItem extends Control {
  private hash: string;

  link: Control;

  constructor(parentNode: HTMLElement, text: string, hash: string) {
    super(parentNode, 'a', headerStyles.nav_item);
    this.hash = hash;
    this.link = new Control(this.node, 'a', headerStyles.nav_link);
    this.link.node.setAttribute('href',`#${hash}`);
    this.link.node.textContent = text;
  }

  getHash() {
    return this.hash;
  }

  setActive() {
    this.link.node.classList.add(headerStyles.nav_link__active);
    console.log('setActiveClass')
  }

  setInactive() {
    this.link.node.classList.remove(headerStyles.nav_link__active);
  }
}

export default NavItem;
