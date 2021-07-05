import Control from '../utilities/control';

class ButtonDefault extends Control {
  public onClick: () => void;

  constructor(parentNode: HTMLElement, configView: string, configLang: string) {
    super(parentNode, 'button', configView, configLang);
    this.node.onclick = () => {
      this.onClick();
    };
  }

  buttonDisable(): void {
    this.node.setAttribute('disabled', 'true');
  }

  buttonEnable(): void {
    this.node.removeAttribute('disabled');
  }

  setLangView(configLang: string):void {
    this.node.textContent = configLang;
  }
}

export default ButtonDefault;
