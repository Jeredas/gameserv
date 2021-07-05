import Control from '../../utilities/control';
import { IChatMessage, IuserChatMessage } from '../../utilities/interfaces';

class ChatMessage extends Control {
  constructor(parentNode: HTMLElement, message: IuserChatMessage, chatConfig:IChatMessage) {
    super(parentNode, 'div', chatConfig.block);
    const messageWrapper = new Control(this.node, 'div', chatConfig.wrapper);
    const messageAvatar = new Control(messageWrapper.node, 'div', chatConfig.avatar);
    messageAvatar.node.style.backgroundImage = `url${message.avatar}`;
    const messageMain = new Control(messageWrapper.node, 'div', chatConfig.main);

    const messageHeader = new Control(messageMain.node, 'div', chatConfig.header);
    const messageUser = new Control(messageHeader.node, 'div', chatConfig.user);
    messageUser.node.textContent = message.userName;
    const messageDate = new Control(messageHeader.node, 'div', chatConfig.date);
    messageDate.node.textContent = message.time;

    const messageBody = new Control(messageMain.node, 'div', chatConfig.body);
    messageBody.node.textContent = message.message;
  }
}

export default ChatMessage;
