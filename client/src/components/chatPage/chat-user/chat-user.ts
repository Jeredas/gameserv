import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatUser extends Control {
  private userAvatar: Control;

  private userName: Control;
  private name: string;

  constructor(parentNode: HTMLElement, avatar: string, userName: string) {
    super(parentNode, 'div', chatStyles.chat_user);
    this.name = userName;
    this.userAvatar = new Control(this.node, 'div', chatStyles.default_avatar_small);
    this.userAvatar.node.style.backgroundImage = `url(${avatar})`;
    this.userName = new Control(this.node, 'div', chatStyles.default_name);
    this.userName.node.textContent = userName;
  }

  getUserName() : string {
    return this.name;
  }
}

export default ChatUser;

