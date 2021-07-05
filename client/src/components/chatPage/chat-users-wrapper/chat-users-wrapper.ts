import { IChatUser, IChatUserWrapper, IUsersLang } from '../../utilities/interfaces';
import Control from '../../utilities/control';
import ChatUser from '../chat-user/chat-user';

class ChatUsersWrapper extends Control {
  private playersBlock: Control;

  private spectatorsBlock: Control;

  private spectators: Array<ChatUser> = [];

  private players: Array<ChatUser> = [];

  private userConfig: IChatUser;

  private spectatorHeader: Control;

  private playerHeader: any;

  constructor(parentNode: HTMLElement, configView: IChatUserWrapper, configLang: IUsersLang) {
    super(parentNode, 'div', configView.wrapper);
    this.userConfig = configView.user;
    this.playersBlock = new Control(this.node, 'div', configView.category);
    this.playerHeader = new Control(this.playersBlock.node, 'div', configView.categoryName);
    // this.playerHeader.element.textContent = configLang.players;

    this.spectatorsBlock = new Control(this.node, 'div', configView.category);
    this.spectatorHeader = new Control(this.spectatorsBlock.node, 'div', configView.categoryName);
    this.spectatorHeader.node.textContent = configLang.spectators;
  }

}

export default ChatUsersWrapper;
