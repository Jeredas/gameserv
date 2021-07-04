import { IChatUser } from '../../utilities/interfaces';
import Control from '../../utilities/control';

class ChatUser extends Control {
  private userAvatar: Control;

  private userName: Control;

  constructor(parentNode: HTMLElement, avatar: string, userName: string, configView: IChatUser) {
    super(parentNode, 'div', configView.wrapper);
    this.userAvatar = new Control(this.node, 'div', configView.avatar);
    this.userAvatar.node.style.backgroundImage = `url(${avatar})`;
    this.userName = new Control(this.node, 'div', configView.name);
    this.userName.node.textContent = userName;
  }
}

export default ChatUser;

