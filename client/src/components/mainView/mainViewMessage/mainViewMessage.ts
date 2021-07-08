import { IUserChatMessage } from '../../utilities/interfaces';
import Control from '../../utilities/control';
import mainViewMessageStyles from './mainViewMessage.module.css';

class MainViewMessage extends Control {
  constructor(parentNode: HTMLElement, message: IUserChatMessage) {
    super(parentNode, 'div', mainViewMessageStyles.chat_message);
    const messageWrapper = new Control(this.node, 'div', mainViewMessageStyles.message_wrapper);
    const messageAvatar = new Control(messageWrapper.node, 'div', mainViewMessageStyles.message_avatar);
    console.log(message.avatar);
    messageAvatar.node.style.backgroundImage = `url(${message.avatar})`;
    const messageMain = new Control(messageWrapper.node, 'div', mainViewMessageStyles.message_main);

    const messageHeader = new Control(messageMain.node, 'div', mainViewMessageStyles.message_header);
    const messageUser = new Control(messageHeader.node, 'div', mainViewMessageStyles.message_user);
    messageUser.node.textContent = message.userName;
    const messageDate = new Control(messageHeader.node, 'div', mainViewMessageStyles.message_date);
    messageDate.node.textContent = message.time;

    const messageBody = new Control(messageMain.node, 'div', mainViewMessageStyles.message_body);
    messageBody.node.textContent = message.message;
  }
}

export default MainViewMessage;
