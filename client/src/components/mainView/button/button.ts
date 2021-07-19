import Control from "../../utilities/control";
import crossButtonStyles from './button.module.css';

class Button extends Control {
  public onClick: () => void = () => {};

  constructor(parentNode: HTMLElement, btnContent: string) {
    super(parentNode, 'button', crossButtonStyles.button_channel, btnContent);
    this.node.onclick = () => {
      this.onClick();
    };
  }

  buttonDisable(): void {
    this.node.setAttribute('disabled', 'true');
    this.node.classList.add(crossButtonStyles.disabled);
  }

  buttonEnable(): void {
    this.node.removeAttribute('disabled');
    this.node.classList.remove(crossButtonStyles.disabled);
  }

  buttonHide() {
    this.node.classList.add(crossButtonStyles.hide);
  }

  buttonShow() {
    this.node.classList.remove(crossButtonStyles.hide);
  }
}


export default Button;
