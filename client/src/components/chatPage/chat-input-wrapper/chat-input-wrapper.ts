import { IInputWrapper, IMessageBtn } from '../../utilities/interfaces';
import Control from '../../utilities/control';

class ChatInputWrapper extends Control {
  public onClick: (message: string) => void = () => {};

  public onEnter: (message: string) => void = () => {};

  private chatInput: Control;

  private inputBtn: Control;

  constructor(parentNode: HTMLElement, configView: IInputWrapper, configLang: IMessageBtn) {
    super(parentNode, 'div', configView.wrapper);
    this.chatInput = new Control(this.node, 'input', configView.field);
    this.inputBtn = new Control(this.node, 'button', configView.button, configLang.btn);

    this.chatInput.node.onkeyup = (e) => {
      if (e.key == 'Enter') {
        this.onEnter((this.chatInput.node as HTMLInputElement).value);
      }
    };

    this.inputBtn.node.onclick = () => {
      this.onClick((this.chatInput.node as HTMLInputElement).value);
    };
  }

  clearInput(): void {
    (this.chatInput.node as HTMLInputElement).value = '';
  }

  setLangView(configLang: string):void {
    this.inputBtn.node.textContent = configLang;
  }
}

export default ChatInputWrapper;
