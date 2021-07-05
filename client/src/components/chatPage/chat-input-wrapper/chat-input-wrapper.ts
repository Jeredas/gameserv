import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatInputWrapper extends Control {
  public onClick: (message: string) => void = () => {};

  public onEnter: (message: string) => void = () => {};

  private chatInput: Control;

  private inputBtn: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_input);
    this.chatInput = new Control(this.node, 'input', chatStyles.chat_input_field);
    this.inputBtn = new Control(this.node, 'button', chatStyles.chat_send_button, 'Send');

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
}

export default ChatInputWrapper;
