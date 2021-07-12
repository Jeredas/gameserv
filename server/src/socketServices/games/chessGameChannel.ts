import { CellCoord } from './../../chess-lib/cell-coord';
import { ChatChannel } from '../socketChannel';
import Vector from '../../utils/vector';
import { ChessProcessor } from '../../chess-lib/chess-processor';

interface IChatResponse {
  type: string;
}

interface IChessHistory {
  sign: string;
  move: Array<Vector>;
  time: string;
}

export class ChannelJoinPlayerResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public requestId: number;
  public params: {
    status: string;
  };

  constructor(channelName: string, status: string, requestId: number) {
    this.service = 'chat';
    this.type = 'joined';
    this.channelName = channelName;
    this.requestId = requestId;
    this.params = { status };
  }
}

class ChannelSendPlayersResponse implements IChatResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    player: string;
    players: Array<{ login: string; avatar: string }>;
  };

  constructor(
    channelName: string,
    player: string,
    players: Array<{ login: string; avatar: string }>
  ) {
    this.service = 'chat';
    this.type = 'getPlayers';
    this.channelName = channelName;
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

  constructor(channelName: string, time: number, field: string) {
    this.service = 'chat';
    this.type = 'chessStart';
    this.channelName = channelName;
    this.params = { time, field };
  }
}

class ChessMoveResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    player: string;
    field: Array<Array<string>>;
    winner: string;
    // history: IChessHistory;
  };

  constructor(
    channelName: string,
    player: string,
    field: Array<Array<string>>,
    winner: string
    // history: IChessHistory
  ) {
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

  constructor(
    channelName: string,
    allowed: Array<Vector>,
  ) {
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

export class ChessGameChannel extends ChatChannel {
  chessProcessor: ChessProcessor;
  players: Array<{ login: string; avatar: string }>;
  history: Array<IChessHistory>;

  constructor(name: string, type: string, params: any) {
    super(name, type, params);
    console.log('created ChessGameChannel');
    this.chessProcessor = new ChessProcessor();
    this.players = [];
    this.history = [];
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
              avatar: currentClient.userData.avatar
            });
          }
        } else {
          if (this.players.length < 1) {
            // this.logic.setPlayers(currentClient.userData.login);
            this.players.push({
              login: currentClient.userData.login,
              avatar: currentClient.userData.avatar
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
    const currentClient = this._getUserByConnection(connection);
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
        this.chessProcessor.clearData();
        console.log('chessStartGame() -> field: ', this.chessProcessor.getField());
        const time = Date.now();
        const response = new ChessStartResponse(this.name, time, this.chessProcessor.getField());
        // const response = new ChessStartResponse(this.name, this.chessProcessor.getStartTime(), this.chessProcessor.getField());
        this.sendForAllClients(response);
      }
    }
  }

  chessMove(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser) {
        if (this.chessProcessor.getCurrentPlayer() === currentUser.login) {
          let coords = JSON.parse(params.messageText);
          const clickVector = new Vector(coords.x, coords.y);
          // this.logic.writeSignToField(currentUser.login, clickVector);
          const response = new ChessMoveResponse(
            this.name,
            currentUser.login,
            [],
            ''
            // []
          );
          this.clients.forEach((it) => it.connection.sendUTF(JSON.stringify(response)));
          // if (this.logic.getWinner()) {
          //   this.logic.clearData();
          // }
        }
      }
    }
  }

  chessStop(connection, params) {
    const currentClient = this._getUserByConnection(connection); //this.clients.find((it) => it.connection == connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser.login) {
        console.log(params.messageText);

        const responseDrawAgree = new ChessDrawAgreeResponse(
          this.name,
          params.messageText,
          currentUser.login
        );
        const responseDraw = new ChessDrawResponse(
          this.name,
          params.messageText,
          currentUser.login
        );
        const clients = this.clients.filter(
          (client) => client.userData.login !== currentUser.login
        );
        clients.forEach((it) => it.send(responseDrawAgree));
        currentClient.send(responseDraw);
      }
    }
  }

  chessRemove(connection, params) {
    let currentClient = this._getUserByConnection(connection); //this.clients.find((it) => it.connection == connection);

    if (currentClient) {
      let currentPlayer = currentClient.userData.login;
      const rivalPlayer = this.chessProcessor.getPlayers().find((player) => player !== currentPlayer);
      let rivalClient = this._getUserByLogin(rivalPlayer); //clients.find((client) => client.userData.login === rivalPlayer);

      if (params.messageText === 'agree') {
        const response = new ChessRemoveResponse(this.name, 'draw');
        currentClient.send(response);
        rivalClient.send(response);
      } else if (params.messageText === 'disagree') {
        if (currentPlayer === this.chessProcessor.getCurrentPlayer()) {
          currentClient.send(new ChessRemoveResponse(this.name, 'won', rivalPlayer));
          rivalClient.send(new ChessRemoveResponse(this.name, 'lost', currentPlayer));
        } else {
          currentClient.send(new ChessRemoveResponse(this.name, 'won', rivalPlayer));
          rivalClient.send(new ChessRemoveResponse(this.name, 'lost', currentPlayer));
        }
        // } else if (this.logic.getWinner()) {
        //   if (currentPlayer === this.logic.getWinner()) {
        //     currentClient.send(new ChessRemoveResponse(this.name, 'won', rivalPlayer));
        //     rivalClient.send(new ChessRemoveResponse(this.name, 'lost', currentPlayer));
        //   } else {
        //     currentClient.send(new ChessRemoveResponse(this.name, 'lost', rivalPlayer));
        //     rivalClient.send(new ChessRemoveResponse(this.name, 'won', currentPlayer));
        //   }
      }
      // this.history = this.logic.getFullHistory();
      this.chessProcessor.clearData();
      this.players = [];
    }
  }

  chessFigureGrab(connection, params) {
    let currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser) {
          const coords = JSON.parse(params.messageText)
          const moves = this.chessProcessor.getMoves(new CellCoord(coords.x, coords.y)); //Получение доступных ходов
          const allowed = [new Vector(1, 5), new Vector(1,4)]; // Формат, который ожидает клиент
          currentClient.send(new ChessGrabResponse(this.name, allowed));
      }
    }
  }
}

function getTimeString(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minOutput}:${secOutput}`;
}
