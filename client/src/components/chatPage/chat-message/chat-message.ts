import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatMessage extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_message);
    const messageWrapper = new Control(this.node, 'div', chatStyles.message_wrapper);
    const messageAvatar = new Control(messageWrapper.node, 'div', chatStyles.message_avatar);
    const messageMain = new Control(messageWrapper.node, 'div', chatStyles.message_main);

    const messageHeader = new Control(messageMain.node, 'div', chatStyles.message_header);
    const messageUser = new Control(messageHeader.node, 'div', chatStyles.message_user);
    const messageDate = new Control(messageHeader.node, 'div', chatStyles.message_date);

    const messageBody = new Control(messageMain.node, 'div', chatStyles.message_body);
  }
}

export default ChatMessage;
