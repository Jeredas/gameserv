import ButtonDefault from '../../buttonDefault/buttonDefault';
import Input from '../../inputDefault/inputDefault';
import Control from '../../utilities/control';
import mainViewInputStyles from './mainViewInput.module.css';

class MainViewInput extends Control {
  public onClick: (message: string) => void = () => {};

  public onEnter: (message: string) => void = () => {};

  private mainViewInput: Input;

  private inputBtn: ButtonDefault;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', mainViewInputStyles.chat_input);
    this.mainViewInput = new Input(this.node, 'text', 'chatInput', '', '');
    this.mainViewInput.node.classList.add(mainViewInputStyles.chat_input_field);
    // this.chatInput = new Control(this.node, 'input', chatStyles.chat_input_field);
    // this.inputBtn = new Control(this.node, 'button', mainViewInputStyles.chat_send_button, 'Send');
    this.inputBtn = new ButtonDefault(this.node, '', 'Send');
    this.inputBtn.node.classList.add(mainViewInputStyles.chat_send_button);

    this.mainViewInput.node.onkeyup = (e) => {
      if (e.key == 'Enter') {
        this.onEnter(this.mainViewInput.getValue());
        this.clearInput();
      }
    };

    this.inputBtn.onClick = () => {
      this.onClick(this.mainViewInput.getValue());
      this.clearInput();
    };
  }

  clearInput(): void {
    this.mainViewInput.setValue('');
  }
}

export default MainViewInput;
