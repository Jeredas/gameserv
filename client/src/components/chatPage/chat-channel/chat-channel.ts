import { IChannelData } from '../../../components/utilities/interfaces';
import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatChannel extends Control {
  public onClick: (ChatChannel: string) => void;
  private channelName: string;
  private channelType: string;
  private gameMode: string = '';
  private complexity: string;

  constructor(
    parentNode: HTMLElement,
    channelName: string,
    channelType: string,
    icon: string,
    gameMode = '',
    complexity:string = ''
  ) {
    super(parentNode, 'div', chatStyles.chat_channel);
    const channelText = new Control(this.node, 'div', chatStyles.chat_channel_text);
    channelText.node.textContent = channelName;
    const channelIcon = new Control(this.node, 'div', chatStyles.chat_channel_icon);
    channelIcon.node.style.backgroundImage = `url(${icon})`;
    this.channelName = channelName;
    this.channelType = channelType;
    this.gameMode = gameMode;
    this.complexity = complexity;

    this.node.onclick = () => {
      this.onClick(this.channelName);
    };
  }

  getChannelData(): IChannelData {
    return {
      channelName: this.channelName,
      channelType: this.channelType,
      gameMode: this.gameMode,
      complexity: this.complexity
    };
  }

  addActiveChannel(): void {
    this.node.classList.add(chatStyles.chat_channel_joined);
  }
  removeActiveChannel(): void {
    this.node.classList.remove(chatStyles.chat_channel_joined);
  }
}

export default ChatChannel;
