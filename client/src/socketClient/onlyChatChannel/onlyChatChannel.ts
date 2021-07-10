import Control from '../../components/utilities/control';
import { ISocketService } from '../ISocketService';
import { SocketClient } from '../socketClient';
import Signal from '../signal';
import { ChatChannelModel } from '../chatChannelModel';
import { channelModel } from 'src/components/utilities/config';
import MainView from '../../components/mainView/mainView';
import { IChatUser, IUserChatMessage } from '../../components/utilities/interfaces';
import MainViewUsers from '../../components/mainView/mainViewUsers/mainViewUsers';
import channelStyles from './onlyChatChannel.module.css';
import messageBlockImage from '../../assets/message-inner.png';

export class OnlyChatChannelService implements ISocketService {
  private onSend: (message: Object) => void = null;
  private onRemove: () => void = null;

  public onMessage: Signal<IUserChatMessage> = new Signal();
  public onClose: Signal<any> = new Signal<any>();
  public onOpen: Signal<any> = new Signal<any>();
  public onAny: Signal<any> = new Signal<any>();
  public onUserList: Signal<Array<IChatUser>> = new Signal();

  constructor() {}

  messageHandler(rawMessage: string) {
    // console.log(rawMessage);
    const message = JSON.parse(rawMessage);
    if (message.service === 'chat') {
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
            this.onUserList.emit(
              // params.userList.map((user: string) => ({avatar: '', userName: user}))
              params.userList
            );
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
  // channelName:string;
  //socketClient:SocketClient;

  constructor(socketClient: SocketClient, channelName: string) {
    super(socketClient, channelName);
    //this.socketClient = socketClient;
    this.service = new OnlyChatChannelService();
    this.socketClient.addService(this.service);
    /*this.service.onCreated.add(params=>{
      console.log(params);
    })*/
  }

  private send(method: string, params: Object) {
    this.service.send({
      // sessionId: window.localStorage.getItem('todoListApplicationSessionId'),
      service: this.serviceName,
      endpoint: 'sendToChannel',
      params: {
        channelName: this.channelName,
        channelMethod: method,
        channelRequestParams: {
          ...params,
          sessionId: window.localStorage.getItem('todoListApplicationSessionId')
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

  // CROSS MOVE
  async joinChannel() {
    const joinResponse = await this.sendAwaiting('joinUser', {});
    console.log('status', joinResponse);

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
    this.mainViewMessages.node.style.backgroundImage = `url(${messageBlockImage})`;
    const mesagesFade = new Control(this.mainViewMessages.node, 'div', channelStyles.chat_messages_fade);

    this.mainViewUsers = new MainViewUsers(this.node);

    const connectionIndicator = new Control(this.node);

    this.model.service.onMessage.add((params) => {
      this.mainViewMessages.addMessage(params);
    });

    this.mainViewUsers.onChannelLeave = () => {
      this.model.leaveChannel();
      this.onLeaveClick();
    };

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

    this.mainViewInput.onClick = (message) => {
      this.model.sendMessage(message);
    };

    this.mainViewInput.onEnter = (message) => {
      this.model.sendMessage(message);
    };
    
    this.model.service.onUserList.add(params => this.mainViewUsers.setUsers(params))

  }

  destroy() {
    this.node.remove();
  }
}
