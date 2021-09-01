import { IChannelInfo } from './../../utilities/interfaces';
import { channel } from 'diagnostic_channel';
import { LobbyModel } from './../../../socketClient/lobbyService';
import Control from '../../utilities/control';
import ButtonDefault from '../../buttonDefault/buttonDefault';
import chatStyles from '../chatPage.module.css';
import ChatChannel from '../chat-channel/chat-channel';
import Signal from '../../../socketClient/signal';
import { channelConfig } from '../../utilities/config';

class ChatChannels extends Control {
  public onChannelClick: (name: string) => void;
  model: LobbyModel;
  public onAddBtnClick: () => void;

  public onJoinChannel: Signal<string> = new Signal();
  public onCreateChannel: () => void = () => {};
  private channelContainer: Control;
  private channels: Array<ChatChannel> = [];

  constructor(parentNode: HTMLElement, model: LobbyModel) {
    super(parentNode, 'div', chatStyles.chat_channels);
    this.model = model;
    const chatChannelControl = new Control(this.node, 'div');
    const createChannel = new ButtonDefault(
      chatChannelControl.node,
      chatStyles.chat_button_create,
      'create channel'
    );
    this.channelContainer = new Control(this.node, 'div', chatStyles.chat_channels_list);

    createChannel.onClick = () => {
      this.onCreateChannel();
    };
  }

  addChannel(channelName: string, channelType: string, channelIcon: string, complexity?: string): void {
    const channel = new ChatChannel(
      this.channelContainer.node,
      channelName,
      channelType,
      channelIcon,
      complexity,
      ''
    );
    channel.onClick = (channelName) => {
      this.removeActiveChannels();
      channel.addActiveChannel();
      this.onJoinChannel.emit(channelName);
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
  addChannels(channels: Array<IChannelInfo>) {
    this.channelContainer.node.innerHTML = '';
    channels.forEach((chan) => {
    const channelIcon = channelConfig.get(chan.type).icon;

      this.addChannel(chan.name, chan.type, channelIcon);
    });
  }

  removeActiveChannels(): void {
    this.channels.forEach((chan) => {
      chan.removeActiveChannel();
    });
  }
}

export default ChatChannels;
