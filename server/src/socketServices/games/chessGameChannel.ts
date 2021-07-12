import { CellCoord } from './../../chess-lib/cell-coord';
import { ChatChannel } from '../socketChannel';
import Vector from '../../utils/vector';
import { IChessProcessor } from '../../chess-lib/ichess-processor';
import { ChessProcessor } from '../../chess-lib/chess-processor';
import { ChessColor } from '../../chess-lib/chess-color';

interface IChatResponse {
  type: string;
}

interface IChessHistory {
  sign: string;
  move: Array<Vector>;
  time: string;
  figName: string;
}

export class ChannelJoinPlayerResponse {
  public type: string;
  public service: string;
  public requestId: number;
  public params: {
    status: string;
  };

  constructor(channelName: string, status: string, requestId: number) {
    this.service = 'chat';
    this.type = 'joined';
    this.requestId = requestId;
    this.params = { status };
  }
}

class ChannelSendPlayersResponse implements IChatResponse {
  public type: string;
  public service: string;
  public params: {
    player: string;
    players: Array<{ login: string; avatar: string }>;
  };

  constructor(channelName: string, player: string, players: Array<{ login: string; avatar: string }>) {
    (this.service = 'chat'), (this.type = 'getPlayers');
    this.params = { player, players };
  }
}

class ChessStartResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    time: number;
    field: string;
  };

  constructor(channelName: string, startTime: number, startField: string) {
    this.service = 'chat';
    this.type = 'chessStart';
    this.channelName = channelName;
    this.params = {
      time: startTime,
      field: startField
    };
  }
}

class ChessMoveResponse {
  public type: string;
  public service: string;
  public channelName: string;

  public params: {
    player: string;
    field: string;
    winner: string;
    // history: IChessHistory;
  };

  constructor(channelName: string, player: string, field: string, winner: string, history: string) {
    this.service = 'chat';
    this.type = 'chessMove';
    this.channelName = channelName;
    this.params = {
      player,
      field,
      winner
      // history
    };
  }
}

class ChessGrabResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    allowed: Array<Vector>;
  };

  constructor(channelName: string, allowed: Array<Vector>) {
    this.service = 'chat';
    this.type = 'chessGrab';
    this.channelName = channelName;
    this.params = {
      allowed
    };
  }
}
class ChessDrawResponse {
  public type: string;
  public service: string;
  public channelName: string;
  time: number;
  public params: {
    stop: string;
    player: string;
    method: string;
  };

  constructor(channelName: string, stop: string, player: string) {
    this.service = 'chat';
    this.type = 'chessStop';
    this.channelName = channelName;
    this.params = { stop, player, method: 'drawNetwork' };
  }
}

class ChessDrawAgreeResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    stop: string;
    player: string;
    method: string;
  };

  constructor(channelName: string, stop: string, player: string) {
    this.service = 'chat';
    this.type = 'chessStop';
    this.channelName = channelName;
    this.params = { stop, player, method: 'drawAgreeNetwork' };
  }
}

class ChessRemoveResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    method: string;
    player: string;
  };

  constructor(channelName: string, method: string, player = '') {
    this.service = 'chat';
    this.type = 'chessRemove';
    this.channelName = channelName;
    this.params = { method, player };
  }
}

interface IPlayerData {
  login: string;
  avatar: string;
  color: ChessColor;
}

export class ChessGameChannel extends ChatChannel {
  // logic: ChessGameLogic;
  history: Array<string>; // !!!!! есть ли необходимость иметь историю в канале. Её из chessProcessor будем дёргать
  // gameMode: string;
  chessProcessor: IChessProcessor;
  players: Array<IPlayerData>;

  constructor(name: string, type: string, params: any) {
    super(name, type, params);
    console.log('created ChessGameChannel');
    // this.logic = new ChessGameLogic();
    this.chessProcessor = new ChessProcessor();
    this.players = new Array<IPlayerData>();
    this.history = [];
    this.gameMode = params.gameMode;
  }

  sendForAllClients(response: IChatResponse) {
    this.clients.forEach((client) => {
      client.send(response);
    });
  }

  async joinPlayer(connection: any, params: any) {
    try {
      const currentClient = this._getUserByConnection(connection);
      if (!this.players.find((player) => currentClient.userData.login === player.login)) {
        if (this.gameMode === 'network') {
          if (this.players.length < 2) {
            // this.logic.setPlayers(currentClient.userData.login);
            this.players.push({
              login: currentClient.userData.login,
              avatar: currentClient.userData.avatar,
              color: this.players.length == 0 ? ChessColor.white : ChessColor.black
            });
          }
        } else {
          if (this.players.length < 1) {
            // this.logic.setPlayers(currentClient.userData.login);
            this.players.push({
              login: currentClient.userData.login,
              avatar: currentClient.userData.avatar,
              color: this.players.length == 0 ? ChessColor.white : ChessColor.black
            });
          }
        }
        const response = new ChannelJoinPlayerResponse(this.name, 'ok', params.requestId);
        currentClient.send(response);
      }
    } catch (err) {
      connection.sendUTF(
        JSON.stringify(new ChannelJoinPlayerResponse(this.name, 'error', params.requestId))
      );
    }
  }

  getPlayers(connection, params) {
    const currentClient = this.clients.find((it) => it.connection == connection);
    if (currentClient && currentClient.userData) {
      const response = new ChannelSendPlayersResponse(
        this.name,
        currentClient.userData.login,
        this.players
      );
      this.sendForAllClients(response);
    } else {
      connection.sendUTF(
        JSON.stringify({
          service: 'chat',
          type: 'sendStatus',
          params: {
            requestId: params.requestId,
            status: 'error',
            description: 'not joined'
          }
        })
      );
    }
  }

  chessStartGame(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser.login === params.messageText) {
        this.chessProcessor.startGame();

        const time = Date.now();
        const response = new ChessStartResponse(
          this.name,
          this.chessProcessor.getStartTime(),
          this.chessProcessor.getField()
        );

        console.log('START', response);

        this.history = [];
        this.sendForAllClients(response);
      }
    }
  }

  chessMove(connection, params) {
    const currentClient = this.clients.find((it) => it.connection == connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser) {
        // if (this.logic.getCurrentPlayer() === currentUser.login) {
        if (
          this.players.filter((player) => player.login == currentUser.login)[0].color ==
          this.chessProcessor.getPlayerColor()
        ) {
          let coords = JSON.parse(params.messageText);
          const clickVector = new Vector(coords.x, coords.y);
          // this.logic.writeSignToField(currentUser.login, clickVector);
          const response = new ChessMoveResponse(
            this.name,
            currentUser.login,
            this.chessProcessor.getField(),
            // this.logic.getWinner(),
            // this.logic.getHistory()
            '',
            ''
          );
          this.clients.forEach((it) => it.connection.sendUTF(JSON.stringify(response)));
          // if (this.logic.getWinner()) {
          //   this.logic.clearData();
          // }
        }
      }
    }
  }

  chessFigureGrab(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser) {

        //TODO НУЖЕН Текущий игрок, чтобы только ему показывать возможные ходы

        // if (this.chessProcessor.getCurrentPlayer() === currentUser.login) {

        const coord = JSON.parse(params.messageText);
        const moves = this.chessProcessor.getMoves(new CellCoord(coord.x, coord.y));

        console.log('GRAB', moves);

        let resultStr = '';
        let result = [];
        // moves.forEach((move) => {
        //   resultStr = resultStr + move.toString() + ' ';
        //   const destCoord = move.getResultPosition();
        //   result.push(new Vector(destCoord.x, destCoord.y));
        // });

        const allowed = [ new Vector(1, 5), new Vector(1, 4) ];
        const response = new ChessGrabResponse(this.name, allowed);
        currentClient.send(response);
        // this.sendForAllClients(response);
        // }
      }
    }
  }

  // chessStop(connection, params) {
  // const currentClient = this.clients.find((it) => it.connection == connection);
  // if (currentClient) {
  //   let currentUser = currentClient.userData;
  //   if (currentUser.login) {
  //     const responseDrawAgree = JSON.stringify(
  //       new ChessDrawAgreeResponse(params.messageText, currentUser.login)
  //     );
  //     const responseDraw = JSON.stringify(
  //       new ChessDrawResponse(params.messageText, currentUser.login)
  //     );
  //     const clients = this.clients.filter(
  //       (client) => client.userData.login !== currentUser.login
  //     );
  //     clients.forEach((it) => it.connection.sendUTF(responseDrawAgree));
  //     currentClient.connection.sendUTF(responseDraw);
  //   }
  // }
  // }

  // chessRemove(connection, params) {
  // let currentClient = this.clients.find((it) => it.connection == connection);

  // if (currentClient) {
  //   let currentPlayer = currentClient.userData.login;
  //   const rivalPlayer = this.logic.getPlayers().find((player) => player !== currentPlayer);
  //   let rivalClient = this.clients.find((client) => client.userData.login === rivalPlayer);

  //   if (params.messageText === 'agree') {
  //     const response = JSON.stringify(new ChessRemoveResponse('draw'));
  //     currentClient.connection.sendUTF(response);
  //     rivalClient.connection.sendUTF(response);
  //   } else if (params.messageText === 'disagree') {
  //     if (currentPlayer === this.logic.getCurrentPlayer()) {
  //       currentClient.connection.sendUTF(
  //         JSON.stringify(new ChessRemoveResponse('won', rivalPlayer))
  //       );
  //       rivalClient.connection.sendUTF(
  //         JSON.stringify(new ChessRemoveResponse('lost', currentPlayer))
  //       );
  //     } else {
  //       currentClient.connection.sendUTF(
  //         JSON.stringify(new ChessRemoveResponse('won', rivalPlayer))
  //       );
  //       rivalClient.connection.sendUTF(
  //         JSON.stringify(new ChessRemoveResponse('lost', currentPlayer))
  //       );
  //     }
  //   } else if (this.logic.getWinner()) {
  //     if (currentPlayer === this.logic.getWinner()) {
  //       currentClient.connection.sendUTF(
  //         JSON.stringify(new ChessRemoveResponse('won', rivalPlayer))
  //       );
  //       rivalClient.connection.sendUTF(
  //         JSON.stringify(new ChessRemoveResponse('lost', currentPlayer))
  //       );
  //     } else {
  //       currentClient.connection.sendUTF(
  //         JSON.stringify(new ChessRemoveResponse('lost', rivalPlayer))
  //       );
  //       rivalClient.connection.sendUTF(
  //         JSON.stringify(new ChessRemoveResponse('won', currentPlayer))
  //       );
  //     }
  //   }
  //   this.history = this.logic.getFullHistory();
  //   this.logic.clearData();
  //   this.players = [];
  // }
  // }

  takePlayerOffGame(login): void {
    this.players = this.players.filter((player) => player.login !== login);
  }
}
