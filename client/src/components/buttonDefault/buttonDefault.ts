import Control from '../utilities/control';

class ButtonDefault extends Control {
  public onClick: () => void;

  constructor(parentNode: HTMLElement, configView: string, configLang: string) {
    super(parentNode, 'button', configView, configLang);
    this.node.onclick = () => {
      this.onClick();
    };
  }

  buttonDisable(veiwDisabled = ''): void {
    this.node.setAttribute('disabled', 'true');
    if(veiwDisabled) {
      this.node.classList.add('BUTTON',veiwDisabled);
    }
    
  }

  buttonEnable(veiwDisabled = ''): void {
    this.node.removeAttribute('disabled');
    if(veiwDisabled) {
    this.node.classList.remove(veiwDisabled);
    }
  }

  setLangView(configLang: string):void {
    this.node.textContent = configLang;
  }
}

export default ButtonDefault;
