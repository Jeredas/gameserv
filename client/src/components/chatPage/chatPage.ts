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
import { channel } from 'diagnostic_channel';
import Cross from '../games/cross/cross';
import { GameSelectPopup } from '../game-select-popup/game-select-popup';

class ChatPage extends Control {
  channelBlock: ChatChannels;

  chatMain: Control;

  chatAction: Control;

  chatUsers: ChatUsers;

  messageContainer: Control;

  channels : Array<IChannelInfo>

  public onJoinChannel: () => void = () => { };
  private model: LobbyModel;
  private socket: SocketClient;

  constructor(parentNode: HTMLElement, model: LobbyModel, socket: SocketClient) {
    super(parentNode, 'div', chatStyles.chat_wrapper);
    this.model = model;
    this.socket = socket;
    this.channelBlock = new ChatChannels(this.node,model); //langConfig.chat.channels
    this.chatMain = new Control(this.node, 'div', chatStyles.chat_main);
    // this.chatUsers = new ChatUsers(this.node);
    this.messageContainer = new Control(this.node);
    this.channelBlock.addChannels(this.model.channels.getData())
    this.channelBlock.onJoinChannel.add((channelName) => {
      this.joinChannel(channelName);
    });

    this.channelBlock.onCreateChannel = () => {
      this.createChannel();
    };

    const connectionIndicator = new Control(this.node);
    connectionIndicator.node.style.color = '#0000ff';
    model.service.onClose.add(() => {
      connectionIndicator.node.textContent = 'disconnected';
      //connectionIndicator.node.onclick = ()=>{
      //  model.socketClient.reconnent();
      //}
    });

    model.service.onOpen.add(() => {
      connectionIndicator.node.textContent = 'connected';
      //connectionIndicator.node.onclick = ()=>{
      //  model.socketClient.reconnent();
      //}
    });
    // this.channelList();
    // this.model.service.onChannelList.add((data)=>{
    //   console.log(data,'console.')
    // })
    
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
    console.log('get channelInfo endpoint', params);
    if (params.status === 'ok') {
      const channelOfChoice = channelConfig.get(params.channelType);

      const channelModel = new channelOfChoice.model(this.socket, params.channelName);
      channelModel.joinChannel().then((res) => {
        if (res) {
          let channel = new channelOfChoice.view(this.chatMain.node, channelModel);
          channel.onLeaveClick = () => {
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
          this.channelBlock.addChannels(res.channelList);
          console.log('channel created with type', res.channelType);
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
