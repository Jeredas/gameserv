import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatUsersWrapper extends Control {
  private playersBlock: Control;

  private spectatorsBlock: Control;

  private spectatorHeader: Control;

  private playerHeader: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_users);
    this.playersBlock = new Control(this.node, 'div', chatStyles.chat_category);
    this.playerHeader = new Control(this.playersBlock.node, 'div', chatStyles.chat_category_name);
    this.playerHeader.node.textContent = 'Players: ';

    this.spectatorsBlock = new Control(this.node, 'div', chatStyles.chat_category);
    this.spectatorHeader = new Control(this.spectatorsBlock.node, 'div', chatStyles.chat_category_name);
    this.spectatorHeader.node.textContent = 'Spectators: ';
  }

}

export default ChatUsersWrapper;
