import { IChannelInfo } from './../utilities/interfaces';
import Control from '../utilities/control';
import ChatChannels from '../chatPage/chat-channels-wrapper/chat-channels-wrapper';
import chatStyles from './chatPage.module.css';
import ChatUsers from '../chatPage/chat-users-wrapper/chat-users-wrapper';
import { popupService } from '../popups/popupService/popupService';
import JoinChannelPopup from '../popups/join-channel-popup/join-channel-popup';
import SettingsChannel from '../popups/create-channel-popup/create-channel-popup';
import { LobbyModel } from '../../socketClient/lobbyService';
import { SocketClient } from '../../socketClient/socketClient';
import { IChannelData } from '../utilities/interfaces';
import { channelConfig, channelModel } from '../utilities/config';
import chatImage from '../../assets/chatBg.png';
import { GameSelectPopup } from '../popups/game-select-popup/game-select-popup';
import PaginatedContainer from './paginate-container';
import { OnlyChatChannelView } from '../../socketClient/onlyChatChannel/onlyChatChannel';
import { CrossGameChannelView } from '../../socketClient/crossGameChannel';
import { ChessGameChannelView } from '../../socketClient/chessGameChannel';
import { ComplexityBotPopup } from '../popups/complexity-bot-popup/complexity-bot-popup';
import GameModePopup from '../popups/gameModePopup/game-mode-popup';

class ChatPage extends Control {
  channelBlock: ChatChannels;

  chatMain: PaginatedContainer;

  chatUsers: ChatUsers;

  channels: Array<IChannelInfo>;

  public onJoinChannel: () => void = () => {};
  private model: LobbyModel;
  private socket: SocketClient;
  private joinedChannels: Array<{ 
    channel: OnlyChatChannelView | CrossGameChannelView | ChessGameChannelView,
    channelName: string
  }> = [];

  constructor(parentNode: HTMLElement, model: LobbyModel, socket: SocketClient) {
    super(parentNode, 'div', chatStyles.chat_wrapper);
    this.node.style.backgroundImage = `url(${chatImage})`;
    this.model = model;
    this.socket = socket;
    this.chatMain = new PaginatedContainer(this.node, chatStyles.chat_main);
    this.channelBlock = new ChatChannels(this.node, model);
    this.channelBlock.addChannels(this.model.channels.getData());
    this.channelBlock.onJoinChannel.add((channelName) => {
      this.joinChannel(channelName);
    });

    this.channelBlock.onCreateChannel = () => {
      this.createChannel();
    };

    this.model.channels.onUpdate.add((channels) => {
      this.channelBlock.addChannels(channels.to);
    });
  }

  joinChannel(chanName?: string) {
    if (chanName == '') {
      popupService.showPopup(JoinChannelPopup).then((channelName: string) => {
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
          let channel = new channelOfChoice.view(null, channelModel, params.gameMode);
          this.chatMain.add(params.channelName, channel);
          channel.onLeaveClick = () => {
            this.chatMain.remove(params.channelName);
            channel.destroy();
          };
          this.joinedChannels.push(
            {
            channel: channel,
            channelName: params.channelName
          });
          channel.resizeView();
        }
      });
      // window.onresize(null);
    }
  }

  createChannel() {
    popupService.showPopup<string>(GameSelectPopup).then((channelType) => {
      if (channelType !== 'ChessGameChannel') {
        popupService.showPopup<IChannelData>(GameModePopup).then((newChannel) => {
          newChannel.channelType = channelType;
          this.model.createNewChannel(newChannel).then((res: any) => {
            if (res.status === 'ok') {
              const channelIcon = channelConfig.get(newChannel.channelType).icon;
              this.channelBlock.addChannel(
                newChannel.channelName,
                newChannel.channelType,
                channelIcon
              );
            }
          });
        });
      } else {
        popupService.showPopup(SettingsChannel).then((newChannel: IChannelData) => {
          newChannel.channelType = channelType;
          if(newChannel.gameMode === 'bot') {
            popupService.showPopup<string>(ComplexityBotPopup).then((complexity) => {
              this.model.createNewChannel(newChannel).then((res: any) => {
                if (res.status === 'ok') {
                  const channelIcon = channelConfig.get(newChannel.channelType).icon;
                  this.channelBlock.addChannel(
                    newChannel.channelName,
                    newChannel.channelType,
                    channelIcon,
                    complexity
                  );
                }
              });
            })
          } else {
            this.model.createNewChannel(newChannel).then((res: any) => {
              if (res.status === 'ok') {
                const channelIcon = channelConfig.get(newChannel.channelType).icon;
                this.channelBlock.addChannel(
                  newChannel.channelName,
                  newChannel.channelType,
                  channelIcon
                );
              }
            });
          }
        });
      }
    });
  }
  channelList(): void {
    this.model.channelList();
  }
  hide(): void {
    this.node.classList.add(chatStyles.default_hidden);
  }

  show(): void {
    this.node.classList.remove(chatStyles.default_hidden);
  }

  userDisconnect() {
    this.joinedChannels.forEach((channel) => {
      this.chatMain.remove(channel.channelName);
      channel.channel.destroy();
    })
  }
}

export default ChatPage;
