import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';


class ChatMessagesBlock extends Control {

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_messages);
  }

}

export default ChatMessagesBlock;
