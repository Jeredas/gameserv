class Control {
  public node: HTMLElement;

  constructor(parentNode: HTMLElement | null, tagName = 'div', className = '', content = '') {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = content;
    if (parentNode) {
      parentNode.append(el);
    }
    this.node = el;
  }

  destroy(): void {
    this.node.remove();
  }
  
}

export default Control;
