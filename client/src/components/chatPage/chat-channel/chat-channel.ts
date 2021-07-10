import { IChannelData } from 'src/components/utilities/interfaces';
import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatChannel extends Control {
  public onClick: (ChatChannel: string) => void;
  private channelName: string;
  private channelType: string;
  private gameMode: string = '';

  constructor(parentNode: HTMLElement, channelName: string, channelType: string, gameMode = '') {
    super(parentNode, 'div', chatStyles.chat_channel, channelName);
    this.channelName = channelName;
    this.channelType = channelType;
    this.gameMode = gameMode;

    this.node.onclick = () => {
      this.onClick(this.channelName);
    };
  }

  getChannelData(): IChannelData {
    return {
      channelName: this.channelName,
      channelType: this.channelType,
      gameMode: this.gameMode
    };
  }
}

export default ChatChannel;
