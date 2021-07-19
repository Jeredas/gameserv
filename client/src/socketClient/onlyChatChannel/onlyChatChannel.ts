import Control from '../../components/utilities/control';
import { ISocketService } from '../ISocketService';
import { SocketClient } from '../socketClient';
import Signal from '../signal';
import { ChatChannelModel } from '../chatChannelModel';
import { channelModel } from '../../components/utilities/config';
import MainView from '../../components/mainView/mainView';
import { IChatUser, IUserChatMessage } from '../../components/utilities/interfaces';
import MainViewUsers from '../../components/mainView/mainViewUsers/mainViewUsers';
import channelStyles from './onlyChatChannel.module.css';
import messageBlockImage from '../../assets/onlyChatBg.png';
import appStorage from '../../components/utilities/storage';

export class OnlyChatChannelService implements ISocketService {
  private onSend: (message: Object) => void = null;
  private onRemove: () => void = null;

  public onMessage: Signal<IUserChatMessage> = new Signal();
  public onClose: Signal<any> = new Signal<any>();
  public onOpen: Signal<any> = new Signal<any>();
  public onAny: Signal<any> = new Signal<any>();
  public onUserList: Signal<Array<IChatUser>> = new Signal();
  private channelName: string;

  constructor(channelName: string) {
    this.channelName = channelName;
  }

  messageHandler(rawMessage: string) {
    const message = JSON.parse(rawMessage);
    if (message.service === 'chat' && message.channelName === this.channelName) {
      this.onAny.emit(message);
      const processFunction = new Map<string, ((params: any) => void)>([
        [
          'message',
          (params) => {
            this.onMessage.emit({
              avatar: params.avatar,
              userName: params.senderNick,
              time: new Date().toLocaleString('ru'),
              message: params.messageText
            });
          }
        ],
        [
          'userList',
          (params) => {
            this.onUserList.emit(params.userList);
          }
        ]
      ]).get(message.type);

      if (processFunction) {
        processFunction(message.params);
      }
    }
  }

  closeHandler() {
    console.log('close');
    this.onClose.emit({});
  }

  openHandler() {
    console.log('open');
    this.onOpen.emit({});
  }

  attachClient(events: { onSend: (message: Object) => void; onRemove: () => void }) {
    this.onSend = events.onSend;
    this.onRemove = events.onRemove;
  }

  unattachClient() {
    this.onSend = null;
    this.onRemove = null;
  }

  send(message: Object) {
    if (this.onSend) {
      this.onSend(message);
    } else {
      throw new Error('Add service to SocketClient for use send function.');
    }
  }

  remove() {
    if (this.onRemove) {
      this.onRemove();
    } else {
      throw new Error('Add service to SocketClient for use remove function.');
    }
  }
}

export class OnlyChatChannelModel extends ChatChannelModel {
  service: OnlyChatChannelService;
  serviceName: string = 'chat';

  constructor(socketClient: SocketClient, channelName: string) {
    super(socketClient, channelName);
    this.service = new OnlyChatChannelService(channelName);
    this.socketClient.addService(this.service);
  }

  private send(method: string, params: Object) {
    this.service.send({
      service: this.serviceName,
      endpoint: 'sendToChannel',
      params: {
        channelName: this.channelName,
        channelMethod: method,
        channelRequestParams: {
          ...params,
          sessionId: appStorage.getSession()
        }
      }
    });
  }

  private sendAwaiting(method: string, request: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = Date.now() + Math.floor(Math.random() * 10000);
      const listener = (params: any) => {
        if (params.requestId == requestId) {
          this.service.onAny.remove(listener);
          resolve(params);
        }
      };
      this.service.onAny.add(listener);
      this.send(method, { ...request, requestId: requestId });
    });
  }

  sendMessage(message: string) {
    this.send('sendMessage', {
      messageText: message
    });
  }

  leaveChannel() {
    this.send('leaveUser', {});
  }

  async joinChannel() {
    const joinResponse = await this.sendAwaiting('joinUser', {});
    return joinResponse.params.status == 'ok';
  }

  destroy() {
    this.service.remove();
  }
}

export class OnlyChatChannelView extends MainView {
  model: channelModel;
  onLeaveClick: () => void;
  public onMessageSend: (message: string) => void = () => {};

  constructor(parentNode: HTMLElement, model: channelModel) {
    super(parentNode);
    this.model = model;

    this.mainViewAction.node.classList.add(channelStyles.chat_action);
    this.mainViewMessages.node.classList.add(channelStyles.chat_messages);
    this.mainViewInput.node.classList.add(channelStyles.only_chat);
    this.mainViewMessages.node.style.backgroundImage = `url(${messageBlockImage})`;
    this.mainViewUsers = new MainViewUsers(this.node);

    this.model.service.onMessage.add((params: IUserChatMessage) => {
      this.mainViewMessages.addMessage(params);
    });

    this.mainViewUsers.onChannelLeave = () => {
      this.model.leaveChannel();
      this.onLeaveClick();
    };

    this.mainViewInput.onClick = (message) => {
      if(message) {
        this.model.sendMessage(message);
      }
    };

    this.mainViewInput.onEnter = (message) => {
      if(message) {
        this.model.sendMessage(message);
      }
    };

    this.model.service.onUserList.add((params: Array<IChatUser>) =>
      this.mainViewUsers.setUsers(params)
    );
  }

  resizeView() {}

  destroy() {
    this.node.remove();
  }
}
