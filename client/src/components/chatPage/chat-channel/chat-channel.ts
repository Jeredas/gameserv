import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatChannel extends Control {
  onClick: () => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_channel);
    this.node.onclick = () => {
      this.onClick();
    };
  }
}

export default ChatChannel;
