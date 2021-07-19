import Control from "../utilities/control";
import { IUserChatMessage } from "../utilities/interfaces";
import MainViewMessage from "./mainViewMessage/mainViewMessage";
import mainViewStyles from './mainView.module.css';

class MainViewMessages extends Control {
  private messages: Array<MainViewMessage> = [];


  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', mainViewStyles.chat_messages);
  }

  addMessage(message: IUserChatMessage): void {
    const messageItem = new MainViewMessage(this.node, message);
    this.messages.push(messageItem);
    this.node.scrollTop = this.node.scrollHeight;
  }
}

export default MainViewMessages;
