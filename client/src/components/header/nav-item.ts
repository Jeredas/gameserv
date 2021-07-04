import Control from '../utilities/control';

class NavItem extends Control {
  private link: HTMLAnchorElement;

  private hash: string;

  constructor(parentNode: HTMLElement, text: string, hash: string) {
    super(parentNode, 'div', 'nav_item');
    this.hash = hash;
    const link = new Control(this.node, 'a', 'nav_link');
    link.node.setAttribute('src',`#${hash}`);
    link.node.textContent = text;
  }

  getHash() {
    return this.hash;
  }

  setActive() {
    this.link.classList.add('nav_link__active');
  }

  setInactive() {
    this.link.classList.remove('nav_link__active');
  }
}

export default NavItem;
