import { IChessStart, IChessData, IChessStop } from './../components/utilities/interfaces';
import { ISocketService } from './ISocketService';
import { SocketClient } from './socketClient';
import Signal from './signal';
import { ChatChannelModel } from './chatChannelModel';
import { channelModel } from '../components/utilities/config';
import MainView from '../components/mainView/mainView';
import { IChatUser, IJoinedPlayer, IUserChatMessage } from '../components/utilities/interfaces';
import ChessGame from '../components/games/chess/chess-game';
import Vector from '../components//utilities/vector';
import MainViewPlayers from '../components/mainView/mainViewPlayers/mainViewPlayers';
import MainViewUsers from '../components/mainView/mainViewUsers/mainViewUsers';

export class ChessGameChannelService implements ISocketService {
  private onSend: (message: Object) => void = null;
  private onRemove: () => void = null;

  public onMessage: Signal<IUserChatMessage> = new Signal();
  public onClose: Signal<any> = new Signal<any>();
  public onOpen: Signal<any> = new Signal<any>();
  public onAny: Signal<any> = new Signal<any>();

  public onJoinedPlayer: Signal<IJoinedPlayer> = new Signal();
  public onChessStart: Signal<IChessStart> = new Signal();
  public onChessMove: Signal<IChessData> = new Signal();
  public onChessStop: Signal<IChessStop> = new Signal();
  public onChessRemove: Signal<{ method: string; player: string }> = new Signal();
  public onUserList: Signal<Array<IChatUser>> = new Signal();
  public onPlayerList: Signal<Array<{ login: string; avatar: string }>> = new Signal();
  public onChessGrab: Signal<Array<Vector>> = new Signal();
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
          'getPlayers',
          (params) => {
            this.onJoinedPlayer.emit({
              player: params.player,
              players: params.players
            });
          }
        ],
        [
          'chessStart',
          (params) => {
            this.onChessStart.emit({
              field: params.field,
              time: params.time
            });
          }
        ],
        [
          'chessMove',
          (params) => {
            this.onChessMove.emit({
              coords: JSON.parse(params.coords),
              player: params.player,
              field: params.field,
              rotate: params.rotate,
              winner: params.winner,
              history: params.history,
              king: params.king
            });
          }
        ],
        [
          'chessGrab',
          (params) => {
            this.onChessGrab.emit(params.allowed);
          }
        ],
        [
          'chessStop',
          (params) => {
            this.onChessStop.emit({
              stop: params.stop,
              player: params.player,
              method: params.method
            });
          }
        ],
        [
          'chessRemove',
          (params) => {
            this.onChessRemove.emit({
              method: params.method,
              player: params.player
            });
          }
        ],
        [
          'userList',
          (params) => {
            this.onUserList.emit(params.userList);
          }
        ],
        [
          'playerList',
          (params) => {
            this.onPlayerList.emit(
              // params.userList.map((user: string) => ({avatar: '', userName: user}))
              params.playerList
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

export class ChessGameChannelModel extends ChatChannelModel {
  service: ChessGameChannelService;
  serviceName: string = 'chat';
  channelName: string;
  //socketClient:SocketClient;

  constructor(socketClient: SocketClient, channelName: string) {
    super(socketClient, channelName);
    this.service = new ChessGameChannelService(channelName);
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

  leavePlayer() {
    this.send('leaveChessChannel', {});
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

  chessStartGame(message: string) {
    this.send('chessStartGame', {
      messageText: message
    });
  }

  chessMove(message: string) {
    this.send('chessMove', {
      messageText: message
    });
  }

  chessStop(message: string) {
    this.send('chessStop', {
      messageText: message
    });
  }

  chessRemove(message: string) {
    this.send('chessRemove', {
      messageText: message
    });
  }

  chessGrab(message: string) {
    this.send('chessFigureGrab', {
      messageText: message
    });
  }

  destroy() {
    this.service.remove();
  }
}

export class ChessGameChannelView extends MainView {
  model: ChessGameChannelModel;
  onLeaveClick: () => void;
  chessGame: ChessGame = null;

  constructor(parentNode: HTMLElement, model: channelModel, chessMode: string) {
    super(parentNode);
    this.model = model as ChessGameChannelModel;
    this.mainViewPlayers = new MainViewPlayers(this.node);
    this.mainViewUsers = new MainViewUsers(this.node);
    const parentHeight = this.mainViewAction.node.getBoundingClientRect().height - 140;

    this.chessGame = new ChessGame(this.mainViewAction.node, chessMode, parentHeight);

    this.model.getPlayers('');
    this.mainViewPlayers.onGameEnter = () => {
      this.model.joinPlayer().then((res) => {
        console.log('Join', res);
        if (res) {
          this.model.getPlayers('');
        }
      });
    };

    this.chessGame.onStartClick = (player: string) => {
      this.model.chessStartGame(player);
    };

    this.chessGame.onFigureDrop = (posStart: Vector, posDrop: Vector) => {
      this.model.chessMove(JSON.stringify([ posStart, posDrop ]));
    };

    this.chessGame.onFigureGrab = (coords: Vector) => {
      this.model.chessGrab(JSON.stringify(coords));
    };

    this.model.service.onJoinedPlayer.add((params) => {
      if (params.players.length) {
        this.chessGame.setPlayer(params);
        this.mainViewPlayers.setPlayers(params.players);
      }
    });

    this.model.service.onChessStart.add((params) => {
      this.chessGame.startGame(params);
    });

    this.model.service.onChessMove.add((params) => {
        this.chessGame.onFigureMove(params);
      if (params.king.mate) {
        console.log('KING MATE', params.king.mate);
        this.chessGame.showKingMate(params.king.check)
      }
      
      // if (params.winner) {
      //   console.log(`Winner: ${params.winner}`);
      //   this.model.chessRemove('won');
      //   this.chessGame.timer.stop();
      // }
    });

    this.model.service.onMessage.add((params) => {
      this.mainViewMessages.addMessage(params);
    });

    // this.mainViewUsers.onChannelLeave = () => {
    //   this.model.leaveChannel();
    //   this.onLeaveClick();
    // };

    this.mainViewUsers.onChannelLeave = () => {
      this.model.leavePlayer();
      this.onLeaveClick();
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
    this.chessGame.onDrawClick = () => {
      this.model.chessStop('draw');
    };

    this.chessGame.onLossClick = () => {
      this.model.chessStop('loss');
    };

    this.chessGame.onModalDrawClick = (response: string) => {
      this.model.chessRemove(response);
    };

    this.model.service.onChessStop.add((params) => {
      this.chessGame.createModalDraw(params);
    });
    this.model.service.onChessRemove.add((params) => {

      this.chessGame.createModalGameOver(params);
    });
    this.chessGame.onGameOverClick = () => {
      this.mainViewPlayers.setPlayers([]);
      this.chessGame.clearData();
    };

    this.model.service.onUserList.add((params) => {
      this.mainViewUsers.setUsers(params);
    });

    this.model.service.onPlayerList.add((params) => {
      this.mainViewPlayers.setPlayers(params);
    });

    this.model.service.onChessGrab.add((allowed) => {
      const allowedMoves = allowed.map((move) => new Vector(move.x, move.y));
      this.chessGame.showAllowedMoves(allowedMoves);
    });
  }

  destroy() {
    this.node.remove();
  }
}
