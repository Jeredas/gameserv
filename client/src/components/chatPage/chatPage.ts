import Control from '../utilities/control';
import ChatChannels from '../chatPage/chat-channels-wrapper/chat-channels-wrapper';
import chatStyles from './chatPage.module.css';
import ChatMessagesBlock from '../chatPage/chat-messages/chat-messages';
import ChatInputWrapper from '../chatPage/chat-input-wrapper/chat-input-wrapper';
import ChatUsersWrapper from '../chatPage/chat-users-wrapper/chat-users-wrapper';
import { popupService } from '../popupService/popupService';
import JoinChannelPopup from '../join-channel-popup/join-channel-popup';
import SettingsChannel from '../create-channel-popup/create-channel-popup';
import { LobbyModel } from '../../socketClient/lobbyService';
import { SocketClient } from '../../socketClient/socketClient';
import { OnlyChatChannelModel, OnlyChatChannelView } from '../../socketClient/onlyChatChannel';

class ChatPage extends Control {
  channelBlock: ChatChannels;

  chatMain: Control;

  chatAction: Control;

  chatUsers: ChatUsersWrapper;

  messageContainer: Control;
  public onJoinChannel: () => void = () => {};
  private model: LobbyModel;
  private socket: SocketClient;

  constructor(parentNode: HTMLElement, model: LobbyModel, socket: SocketClient) {
    super(parentNode, 'div', chatStyles.chat_wrapper);
    this.model = model;
    this.socket = socket;
    this.channelBlock = new ChatChannels(this.node); //langConfig.chat.channels
    this.chatMain = new Control(this.node, 'div', chatStyles.chat_main);
    this.chatAction = new Control(this.chatMain.node, 'div', chatStyles.chat_action);
    // this.chatAction.node.style.backgroundImage = `url(${bgImage})`;
    const chatMessages = new ChatMessagesBlock(this.chatMain.node);
    const chatInputBlock = new ChatInputWrapper(this.chatMain.node);
    this.chatUsers = new ChatUsersWrapper(this.node);

    this.messageContainer = new Control(this.node);

    this.channelBlock.onJoinChannel = () => {
      this.joinChannel();
    };

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
  }

  joinChannel() {
    popupService.showPopup(JoinChannelPopup).then((channelName: string) => {
      console.log(channelName);
      let onlyChatChannelModel = new OnlyChatChannelModel(this.socket, channelName);

      onlyChatChannelModel.joinChannel().then((res) => {
        console.log('join channel', res);
        if (res) {
          let channel = new OnlyChatChannelView(document.body, onlyChatChannelModel);
          channel.onLeaveClick = () => {
            channel.destroy();
          };
        }
      });
    });
  }

  createChannel() {
    popupService.showPopup(SettingsChannel).then((channelName: string) => {
      this.model.createNewChannel(channelName).then((res) => {
        if (res) {
          this.channelBlock.addChannel(channelName);
        }
      });
    });
  }

  hide(): void {
    this.node.classList.add(chatStyles.default_hidden);
  }

  show(): void {
    this.node.classList.remove(chatStyles.default_hidden);
  }
}

export default ChatPage;
