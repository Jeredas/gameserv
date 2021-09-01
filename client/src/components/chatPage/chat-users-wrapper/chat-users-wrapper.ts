import Control from '../../utilities/control';
import ChatUser from '../chat-user/chat-user';
import chatStyles from '../chatPage.module.css';

class ChatUsers extends Control {
  private playersBlock: Control;

  private spectatorsBlock: Control;

  private spectators: Array<ChatUser> = [];

  private players: Array<ChatUser> = [];

  private spectatorHeader: Control;

  private playerHeader: any;
  // authModel : AuthModel

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_users);
    this.spectatorsBlock = new Control(this.node, 'div', chatStyles.chat_category);
    this.spectatorHeader = new Control(
      this.spectatorsBlock.node,
      'div',
      chatStyles.chat_category_name
    );
    this.spectatorHeader.node.textContent = 'Spectators: ';
    // this.authModel = new AuthModel();
  }

  setSpectators(userList: Array<{ login: string; avatar: string }>): void {
    this.spectators.forEach((user) => user.destroy());
    this.spectators = [];
    console.log(userList);

    this.spectators = userList.map((user) => {
      console.log(user);
      const chatUser = new ChatUser(this.spectatorsBlock.node, user.avatar, user.login);
      return chatUser;
    });
  }
}

export default ChatUsers;
