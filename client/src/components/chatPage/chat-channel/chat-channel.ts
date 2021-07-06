import Control from '../../utilities/control';
import chatStyles from '../chatPage.module.css';

class ChatChannel extends Control {
  public onClick: (ChatChannel: string) => void;
  private channelName: string;

  constructor(parentNode: HTMLElement, channelName: string) {
    super(parentNode, 'div', chatStyles.chat_channel, channelName);
    this.channelName = channelName;

    this.node.onclick = () => {
      this.onClick(this.channelName);
    };
  }

  getChannelName(): string {
    return this.channelName;
  }
}

export default ChatChannel;
