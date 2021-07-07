import Control from '../../utilities/control';
import ButtonDefault from '../../buttonDefault/buttonDefault';
import chatStyles from '../chatPage.module.css';
import ChatChannel from '../chat-channel/chat-channel';

class ChatChannels extends Control {
  public onChannelClick: (name: string) => void;

  public onAddBtnClick: () => void;

  public onJoinChannel: () => void = () => {};
  public onCreateChannel: () => void = () => {};
  private channelContainer: Control;
  private channels: Array<ChatChannel> = [];

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_channels);
    const chatChannelControl = new Control(this.node, 'div');
    const createChannel = new ButtonDefault(
      chatChannelControl.node,
      chatStyles.default_button,
      'create channel'
    );
    const joinChannel = new ButtonDefault(
      chatChannelControl.node,
      chatStyles.default_button,
      'join channel'
    );
    this.channelContainer = new Control(this.node, 'div', chatStyles.chat_channels_list);

    joinChannel.onClick = () => {
      console.log('join');
      this.onJoinChannel();
    };

    createChannel.onClick = () => {
      console.log('create');
      this.onCreateChannel();
    };
  }

  addChannel(channelName: string): void {
    const channel = new ChatChannel(this.channelContainer.node, channelName, '');
    channel.onClick = (channelName) => {
      console.log(channelName);
    };
    this.channels.push(channel);
  }

  removeChannel(channelName: string): void {
    this.channels = this.channels.filter((channel) => {
      if (channel.getChannelData().channelName === channelName) {
        channel.destroy();
      } else return channel;
    });
  }
}

export default ChatChannels;
