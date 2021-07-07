import Control from "../../../components/utilities/control";

class CrossButton extends Control {
  public onClick: () => void = () => {};

  constructor(parentNode: HTMLElement, btnStyle: string, btnContent: string) {
    super(parentNode, 'button', btnStyle, btnContent);
    this.node.onclick = () => {
      this.onClick();
    };
  }
}

export default CrossButton;
