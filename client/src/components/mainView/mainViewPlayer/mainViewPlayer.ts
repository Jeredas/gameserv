import Control from '../../utilities/control';
import mainViewPlayer from '../mainView.module.css';

class MainViewPlayer extends Control {
  private userAvatar: Control;

  private userName: Control;
  private name: string;

  constructor(parentNode: HTMLElement, avatar: string, userName: string) {
    super(parentNode, 'div', mainViewPlayer.chat_user);
    this.name = userName;
    this.userAvatar = new Control(this.node, 'div', mainViewPlayer.default_avatar_small);
    if(avatar) {
      this.userAvatar.node.style.backgroundImage = `url(${avatar})`;
    }
    this.userName = new Control(this.node, 'div', mainViewPlayer.default_name);
    this.userName.node.textContent = userName;
  }

  getUserName() : string {
    return this.name;
  }
}

export default MainViewPlayer;

