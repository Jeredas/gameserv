import Control from '../components/utilities/control';
import { ISocketService } from './ISocketService';
import { SocketClient } from './socketClient';
import Signal from './signal';
import { ChatChannelModel } from './chatChannelModel';
import { channelModel } from '../components/utilities/config';
import MainView from '../components/mainView/mainView';
import { ICrossMove, ICrossStop, IJoinedPlayer, IUserChatMessage } from '../components/utilities/interfaces';
import Cross from '../components/games/cross/cross';
import Vector from '../components//utilities/vector';
import MainViewPlayers from '../components/mainView/mainViewPlayers/mainViewPlayers';

export class CrossGameChannelService implements ISocketService {
  private onSend: (message: Object) => void = null;
  private onRemove: () => void = null;

  public onMessage: Signal<IUserChatMessage> = new Signal();
  public onClose: Signal<any> = new Signal<any>();
  public onOpen: Signal<any> = new Signal<any>();
  public onAny: Signal<any> = new Signal<any>();

  public onJoinedPlayer: Signal<IJoinedPlayer> = new Signal();
  public onCrossStart: Signal<number> = new Signal();
  public onCrossMove: Signal<ICrossMove> = new Signal();
  public onCrossStop: Signal<ICrossStop> = new Signal();
  public onCrossRemove: Signal<{method: string, player: string}> = new Signal();

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
          'getPlayers',
          (params) => {
            this.onJoinedPlayer.emit({
              player: params.player,
              players: params.players
            });
          }
        ],
        [
          'crossStart',
          (params) => {
            this.onCrossStart.emit(JSON.parse(params.time));
          }
        ],
        [
          'crossMove',
          (params) => {
            this.onCrossMove.emit({
              player: params.player,
              field: params.field,
              winner: params.winner,
              history: params.history
            });
          }
        ],
        [
          'crossStop',
          (params) => {
            this.onCrossStop.emit({
              stop: params.stop, 
              player: params.player, 
              method: params.method 
            });
          }
        ],
        [
          'crossRemove',
          (params) => {
            this.onCrossRemove.emit({
              method: params.method,
              player: params.player
            });
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

export class CrossGameChannelModel extends ChatChannelModel {
  service: CrossGameChannelService;
  serviceName: string = 'chat';
  channelName: string;
  //socketClient:SocketClient;

  constructor(socketClient: SocketClient, channelName: string) {
    super(socketClient, channelName);
    this.service = new CrossGameChannelService();
    this.socketClient.addService(this.service);
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

  async joinChannel() {
    const joinResponse = await this.sendAwaiting('joinUser', {});
    console.log('status', joinResponse);

    return joinResponse.params.status == 'ok';
  }

  async joinPlayer() {
    const joinResponse = await this.sendAwaiting('joinPlayer', {});
    console.log('status JOIN PLAYER', joinResponse);

    return joinResponse.params.status == 'ok';
  }

  getPlayers(message: string) {
    this.send('getPlayers', {
      messageText: message
    });
  }

  crossStartGame(message: string) {
    this.send('crossStartGame', {
      messageText: message
    });
  }

  crossMove(message: string) {
    this.send('crossMove', {
      messageText: message
    });
  }

  crossStop(message: string) {
    this.send('crossStop', {
      messageText: message
    });
  }

  crossRemove(message: string) {
    console.log('crossRemove click: ', message);
    
    this.send('crossRemove', {
      messageText: message
    });
  }


  destroy() {
    this.service.remove();
  }
}

export class CrossGameChannelView extends MainView {
  model: CrossGameChannelModel;
  onLeaveClick: () => void;
  crossGame: Cross = null;

  constructor(parentNode: HTMLElement, model: channelModel) {
    super(parentNode);
    this.model = model as CrossGameChannelModel;
    this.mainViewPlayers = new MainViewPlayers(this.node);

    this.crossGame = new Cross(this.mainViewAction.node);
    // const connectionIndicator = new Control(this.node);
    // const sendMessageButton = new Control(this.node, 'div', '', 'send');
    // const leaveMessageButton = new Control(this.node, 'div', '', 'leave');

    // const messagesContainer = new Control(this.node);

    this.mainViewPlayers.onGameEnter = () => {
      this.model.joinPlayer().then((res) => {
        console.log('Join', res);
        if (res) {
          this.model.getPlayers('');
        }
      });
    }

    this.crossGame.onStartClick = () => {
      this.model.crossStartGame('');
    };

    this.crossGame.onCellClick = (coords: Vector) => {
      this.model.crossMove(JSON.stringify(coords));
    };

    this.model.service.onJoinedPlayer.add((params) => {
      this.crossGame.setPlayer(params);
      this.mainViewPlayers.setPlayers(params.players);
    });

    this.model.service.onCrossStart.add((params) => {
      this.crossGame.startGame(params);
    });
    this.model.service.onCrossMove.add((params) => {
      this.crossGame.updateGameField(params.field);
      this.crossGame.setHistoryMove(params.history);
      if (params.winner) {
        console.log(`Winner: ${params.winner}`);
        this.model.crossRemove('won');
        this.crossGame.timer.stop();
      }
    });

    this.model.service.onMessage.add((params) => {
      this.mainViewMessages.addMessage(params);
    });

    this.mainViewPlayers.onChannelLeave = () => {
      this.model.leaveChannel();
      this.onLeaveClick?.();
    };

    // model.service.onClose.add(() => {
    //   connectionIndicator.node.textContent = 'disconnected';
    //   //connectionIndicator.node.onclick = ()=>{
    //   //  model.socketClient.reconnent();
    //   //}
    // });

    // model.service.onOpen.add(() => {
    //   connectionIndicator.node.textContent = 'connected';
    //   //connectionIndicator.node.onclick = ()=>{
    //   //  model.socketClient.reconnent();
    //   //}
    // });

    this.mainViewInput.onClick = (message) => {
      this.model.sendMessage(message);
    };

    this.mainViewInput.onEnter = (message) => {
      this.model.sendMessage(message);
    };
    this.crossGame.onDrawClick = () => {
      this.model.crossStop('draw');
    }

    this.crossGame.onLossClick = () => {
      this.model.crossStop('loss');
    }

    this.crossGame.onModalDrawClick = (response: string) => {
      this.model.crossRemove(response);
    }

    this.model.service.onCrossStop.add((params) => {
      this.crossGame.createModalDraw(params)
    })
    this.model.service.onCrossRemove.add((params) => {
      this.crossGame.createModalGameOver(params);
    })
    this.crossGame.onGameOverClick = () => {
      this.crossGame.clearData();
    }

  }

  destroy() {
    this.node.remove();
  }
}
