import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatUser extends Control {
  private userAvatar: Control;

  private userName: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_user);
    this.userAvatar = new Control(this.node, 'div', chatStyles.default_avatar_small);
    this.userName = new Control(this.node, 'div', chatStyles.default_name);
    this.userName.node.textContent = 'User name';
  }
}

export default ChatUser;

