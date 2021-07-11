import { LobbyService } from '../../socketClient/lobbyService';
import { IChannelInfo } from './../utilities/interfaces';
import Control from '../utilities/control';
import ChatChannels from '../chatPage/chat-channels-wrapper/chat-channels-wrapper';
import chatStyles from './chatPage.module.css';
import ChatUsers from '../chatPage/chat-users-wrapper/chat-users-wrapper';
import { popupService } from '../popupService/popupService';
import JoinChannelPopup from '../join-channel-popup/join-channel-popup';
import SettingsChannel from '../create-channel-popup/create-channel-popup';
import { LobbyModel } from '../../socketClient/lobbyService';
import { SocketClient } from '../../socketClient/socketClient';
import { IChannelData } from '../utilities/interfaces';
import { channelConfig } from '../utilities/config';
import chatImage from '../../assets/bg-chat.jpg';

class ChatPage extends Control {
  channelBlock: ChatChannels;

  chatMain: Control;

  chatAction: Control;

  chatUsers: ChatUsers;

  channels : Array<IChannelInfo>

  public onJoinChannel: () => void = () => { };
  private model: LobbyModel;
  private socket: SocketClient;

  constructor(parentNode: HTMLElement, model: LobbyModel, socket: SocketClient) {
    super(parentNode, 'div', chatStyles.chat_wrapper);
    this.node.style.backgroundImage = `url(${chatImage})`;
    this.model = model;
    this.socket = socket;
    this.channelBlock = new ChatChannels(this.node,model); //langConfig.chat.channels
    this.chatMain = new Control(this.node, 'div', chatStyles.chat_main);
    this.channelBlock.addChannels(this.model.channels.getData())
    this.channelBlock.onJoinChannel.add((channelName) => {
      this.joinChannel(channelName);
    });

    this.channelBlock.onCreateChannel = () => {
      this.createChannel();
    };

    this.model.channels.onUpdate.add((channels)=>{
      console.log(channels)
      this.channelBlock.addChannels(channels.to)
    })
  }

  joinChannel(chanName?: string) {
    if (chanName == '') {
      popupService.showPopup(JoinChannelPopup).then((channelName: string) => {
        console.log(channelName);
        const q = this.model
          .getChannelInfo(channelName)
          .then((params) => this.joinUserToChannel(params));
      });
    } else {
      const q = this.model
        .getChannelInfo(chanName)
        .then((params) => this.joinUserToChannel(params));
    }
  }

  joinUserToChannel(params: any) {
    console.log('joinUserToChannel', params);
    
    if (params.status === 'ok') {
      const channelOfChoice = channelConfig.get(params.channelType);

      const channelModel = new channelOfChoice.model(this.socket, params.channelName);
      channelModel.joinChannel().then((res) => {
        if (res) {
          let channel = new channelOfChoice.view(this.chatMain.node, channelModel, params.chessMode);
          channel.onLeaveClick = () => {
            this.channelBlock.removeActiveChannels();
            channel.destroy();
          };
        }
      });
    }
  }

  createChannel() {
    popupService.showPopup(SettingsChannel).then((newChannel: IChannelData) => {
      this.model.createNewChannel(newChannel).then((res: any) => {
        console.log(res,'chat page res')
        if (res.status === 'ok') {
          const channelIcon = channelConfig.get(newChannel.channelType).icon;
          this.channelBlock.addChannel(newChannel.channelName, newChannel.channelType, channelIcon);
        }
      });
    });
  }
  channelList(): void {
    this.model.channelList()
  }
  hide(): void {
    this.node.classList.add(chatStyles.default_hidden);
  }

  show(): void {
    this.node.classList.remove(chatStyles.default_hidden);
  }
}

export default ChatPage;
