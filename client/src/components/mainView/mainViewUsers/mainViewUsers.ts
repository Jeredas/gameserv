import Control from '../../utilities/control';
import MainViewPlayer from '../mainViewPlayer/mainViewPlayer';
import mainViewUserss from '../mainView.module.css';
import CrossButton from '../../games/cross/button/cross-button';
import { IChatUser } from '../../utilities/interfaces';

class MainViewUsers extends Control {
  private usersBlock: Control;

  private users: Array<MainViewPlayer> = [];

  private userHeader: any;
  private controlBlock: Control;
  private btnLeave: CrossButton;
  public onChannelLeave: () => void = () => {};

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', mainViewUserss.chat_users);
    this.controlBlock = new Control(this.node, 'div', mainViewUserss.chat_category);
    this.usersBlock = new Control(this.node, 'div', mainViewUserss.chat_category);
    this.userHeader = new Control(
      this.usersBlock.node,
      'div',
      mainViewUserss.chat_category_name
    );
    this.userHeader.node.textContent = 'Online: ';
    
    this.btnLeave = new CrossButton(this.controlBlock.node,'Leave the channel');
    this.btnLeave.onClick = () => {
      this.onChannelLeave();
    }
  }

  setUsers(users: Array<IChatUser>): void {
    this.deleteUsers();
    users.forEach((user) => {
      const chatUser = new MainViewPlayer(this.usersBlock.node, user.avatar, user.userName);
      this.users.push(chatUser);
    });
  }

  // setUsers(users: Array<string>): void {
  //   this.deleteUsers();
  //   users.forEach((user) => {
  //     const chatUser = new MainViewPlayer(this.usersBlock.node, user.avatar, user.userName);
  //     this.users.push(chatUser);
  //   });
  // }

  deleteUser(userName: string): void {
    this.users = this.users.map((user) => {
      if (user.getUserName() === userName) {
        user.destroy();
      } else return user;
    });
  }

  deleteUsers(): void {
    this.users.forEach((user) => {
      user.destroy();
    });
    this.users = [];
  }

  getUsersLength(): number {
    return this.users.length;
  }
}

export default MainViewUsers;
