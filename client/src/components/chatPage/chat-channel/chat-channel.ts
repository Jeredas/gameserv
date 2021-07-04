import Control from '../../utilities/control';
import '../chatPage.css';

class ChatChannel extends Control {
  onClick: () => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'chat_channel');
    this.node.onclick = () => {
      this.onClick();
    };
  }
}

export default ChatChannel;
