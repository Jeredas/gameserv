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
import { GameSelectPopup } from '../game-select-popup/game-select-popup';
import OtherGamePopup from '../OtherGamePopup/OtherGamePopup';
import PaginatedContainer from './paginate-container';

class ChatPage extends Control {
  channelBlock: ChatChannels;

  chatMain: PaginatedContainer;

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
    this.channelBlock = new ChatChannels(this.node,model);
    this.chatMain = new PaginatedContainer(this.node, chatStyles.chat_main);
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
    if (params.status === 'ok') {
      const channelOfChoice = channelConfig.get(params.channelType);

      const channelModel = new channelOfChoice.model(this.socket, params.channelName);
      channelModel.joinChannel().then((res) => {
        if (res) {
          let channel = new channelOfChoice.view(null, channelModel, params.chessMode);
          this.chatMain.add(params.channelName, channel);
          channel.onLeaveClick = () => {
            this.channelBlock.removeActiveChannels();
            this.chatMain.remove(params.channelName);
            channel.destroy();
          };
        }
      });
    }
  }

  createChannel() {
    popupService.showPopup<string>(GameSelectPopup).then((channelType) => {
      if (channelType !== 'ChessGameChannel') {
        popupService.showPopup<IChannelData>(OtherGamePopup).then((newChannel) => {
          newChannel.channelType = channelType;
          this.model.createNewChannel(newChannel).then((res: any) => {
            if (res.status === 'ok') {
              const channelIcon = channelConfig.get(newChannel.channelType).icon;
              this.channelBlock.addChannel(newChannel.channelName, newChannel.channelType, channelIcon);
            }
          });
        });
      } else {
        popupService.showPopup(SettingsChannel).then((newChannel: IChannelData) => {
          newChannel.channelType = channelType;
          this.model.createNewChannel(newChannel).then((res: any) => {
            if (res.status === 'ok') {
              const channelIcon = channelConfig.get(newChannel.channelType).icon;
              this.channelBlock.addChannel(newChannel.channelName, newChannel.channelType, channelIcon);
            }
          });
        });
      }
    })
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
