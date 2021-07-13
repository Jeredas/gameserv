import { ChatChannel } from '../socketChannel';
import Vector from '../../utils/vector';

interface IChatResponse {
  type: string;
}

interface ICrossHistory {
  sign: string;
  move: Vector;
  time: string;
  player: string;
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

class ChannelPlayerListResponse implements IChatResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    playerList: Array<{ login: string; avatar: string }>;
  };

  constructor(channelName: string, playerList: Array<{ login: string; avatar: string }>) {
    this.service = 'chat';
    this.type = 'playerList';
    this.channelName = channelName;
    this.params = {
      playerList: [ ...playerList ]
    };
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

class CrossStartResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    time: number;
  };

  constructor(channelName: string, time: number) {
    this.service = 'chat';
    this.type = 'crossStart';
    this.channelName = channelName;
    this.params = { time };
  }
}

class CrossMoveResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    player: string;
    field: Array<Array<string>>;
    winner: string;
    history: ICrossHistory;
  };

  constructor(
    channelName: string,
    player: string,
    field: Array<Array<string>>,
    winner: string,
    history: ICrossHistory
  ) {
    this.service = 'chat';
    this.type = 'crossMove';
    this.channelName = channelName;
    this.params = {
      player,
      field,
      winner,
      history
    };
  }
}

class CrossDrawResponse {
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
    this.type = 'crossStop';
    this.channelName = channelName;
    this.params = { stop, player, method: 'drawNetwork' };
  }
}

class CrossDrawAgreeResponse {
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
    this.type = 'crossStop';
    this.channelName = channelName;
    this.params = { stop, player, method: 'drawAgreeNetwork' };
  }
}
class CrossNoMovesResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    method: string;
    player: string;
  };

  constructor(channelName: string) {
    this.service = 'chat';
    this.type = 'crossNoMoves';
    this.channelName = channelName;
    this.params = { method: 'noMoves', player: '' };
  }
}
class CrossRemoveResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    method: string;
    player: string;
  };

  constructor(channelName: string, method: string, player = '') {
    this.service = 'chat';
    this.type = 'crossRemove';
    this.channelName = channelName;
    this.params = { method, player };
  }
}

export class CrossGameChannel extends ChatChannel {
  logic: CrossGameLogic;
  players: Array<{ login: string; avatar: string }>;
  history: Array<ICrossHistory>;

  constructor(name: string, type: string, params: any) {
    super(name, type, params);
    console.log('created CrossGameChannel');
    this.logic = new CrossGameLogic();
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
      if (
        this.players.length < 2 &&
        !this.players.find((player) => currentClient.userData.login === player.login)
      ) {
        this.logic.setPlayers(currentClient.userData.login);
        this.players.push({
          login: currentClient.userData.login,
          avatar: currentClient.userData.avatar
        });
        const response = new ChannelJoinPlayerResponse(this.name, 'ok', params.requestId);
        currentClient.send(response);
        this._sendForAllClients(
          new ChannelPlayerListResponse(
            this.name,
            this.players.map((it) => ({ login: it.login, avatar: it.avatar }))
          )
        );
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

  leaveCrossChannel(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    this.clients = this.clients.filter((it) => it.connection != connection);

    if (this.players && this.players.length) {
      this.players = this.players.filter((it) => it.login != currentClient.userData.login);

      this._sendForAllClients(
        new ChannelPlayerListResponse(
          this.name,
          this.players.map((it) => ({ login: it.login, avatar: it.avatar }))
        )
      );
      super.leaveUser(connection, params);
    }
  }

  crossStartGame(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient.userData.login === params.messageText) {
      if (currentClient && currentClient.userData) {
        const time = Date.now();
        const response = new CrossStartResponse(this.name, time);
        this.logic.startGame(time);
        this.history = [];
        this.sendForAllClients(response);
      }
    }
  }

  crossMove(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser) {
        if (this.logic.getCurrentPlayer() === currentUser.login) {
          let coords = JSON.parse(params.messageText);
          const clickVector = new Vector(coords.x, coords.y);
          this.logic.writeSignToField(currentUser.login, clickVector);
          const response = new CrossMoveResponse(
            this.name,
            currentUser.login,
            this.logic.getField(),
            this.logic.getWinner(),
            this.logic.getHistory()
          );

          if (this.logic.getNoMove()) {
            this.crossWinnerResponse(connection, params);
          } else {
            this.clients.forEach((it) => it.connection.sendUTF(JSON.stringify(response)));
          }
        }
      }
    }
  }

  crossStop(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser.login) {
        let currentPlayer = currentClient.userData.login;
        const rivalPlayer = this.logic.getPlayers().find((player) => player !== currentPlayer);
        let rivalClient = this._getUserByLogin(rivalPlayer);
        //clients.find((client) => client.userData.login
        if (params.messageText === 'loss') {
          if (currentPlayer === this.logic.getCurrentPlayer()) {
            currentClient.send(new CrossRemoveResponse(this.name, 'lost', rivalPlayer));
            rivalClient.send(new CrossRemoveResponse(this.name, 'won', currentPlayer));
          } else {
            currentClient.send(new CrossRemoveResponse(this.name, 'lost', rivalPlayer));
            rivalClient.send(new CrossRemoveResponse(this.name, 'won', currentPlayer));
          }
          this.history = this.logic.getFullHistory();
          this.logic.clearData();
          this.players = [];
        } else {
          const responseDrawAgree = new CrossDrawAgreeResponse(
            this.name,
            params.messageText,
            currentUser.login
          );
          const responseDraw = new CrossDrawResponse(
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
  }

  crossRemove(connection, params) {
    let currentClient = this._getUserByConnection(connection); //this.clients.find((it) => it.connection == connection);

    if (currentClient) {
      let currentPlayer = currentClient.userData.login;
      const rivalPlayer = this.logic.getPlayers().find((player) => player !== currentPlayer);
      let rivalClient = this._getUserByLogin(rivalPlayer);

      if (params.messageText === 'agree') {
        const response = new CrossRemoveResponse(this.name, 'draw');
        currentClient.send(response);
        rivalClient.send(response);
      } else if (params.messageText === 'disagree') {
        if (currentPlayer === this.logic.getCurrentPlayer()) {
          currentClient.send(new CrossRemoveResponse(this.name, 'won', rivalPlayer));
          rivalClient.send(new CrossRemoveResponse(this.name, 'lost', currentPlayer));
        } else {
          currentClient.send(new CrossRemoveResponse(this.name, 'won', rivalPlayer));
          rivalClient.send(new CrossRemoveResponse(this.name, 'lost', currentPlayer));
        }
      } else if (this.logic.getWinner()) {
        if (currentPlayer === this.logic.getWinner()) {
          currentClient.send(new CrossRemoveResponse(this.name, 'won', rivalPlayer));
          rivalClient.send(new CrossRemoveResponse(this.name, 'lost', currentPlayer));
        } else {
          currentClient.send(new CrossRemoveResponse(this.name, 'lost', rivalPlayer));
          rivalClient.send(new CrossRemoveResponse(this.name, 'won', currentPlayer));
        }
      }
      this.history = this.logic.getFullHistory();
      this.logic.clearData();
      this.players = [];
    }
  }

  crossWinnerResponse(connection, params) {
    let currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentPlayer = currentClient.userData.login;
      const rivalPlayer = this.logic.getPlayers().find((player) => player !== currentPlayer);
      let rivalClient = this._getUserByLogin(rivalPlayer); //clients.find((client) => client.userData.login ===
      if (this.logic.getWinner()) {
        if (currentPlayer === this.logic.getWinner()) {
          currentClient.send(new CrossRemoveResponse(this.name, 'won', rivalPlayer));
          rivalClient.send(new CrossRemoveResponse(this.name, 'lost', currentPlayer));
        } else {
          currentClient.send(new CrossRemoveResponse(this.name, 'lost', rivalPlayer));
          rivalClient.send(new CrossRemoveResponse(this.name, 'won', currentPlayer));
        }
      } else {
        this.clients.forEach((it) =>
          it.connection.sendUTF(JSON.stringify(new CrossNoMovesResponse(this.name)))
        );
      }
    }
    this.history = this.logic.getFullHistory();
    this.logic.clearData();
    this.players = [];
  }
}

let size = 3;
export class CrossGameLogic {
  private field: Array<Array<string>> = [];
  private players: Array<string> = [];
  private currentPlayerIndex: number = 0;
  private signs: Array<string> = [ 'X', 'O' ];
  private winner: string = '';
  private currentSign: string = this.signs[0];
  private gameMode: string = 'network';
  private history: Array<ICrossHistory> = [];
  private startTime: number = 0;
  private moveCounter = 0;
  private noMoves = false;

  constructor() {
    this.field = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];
  }
  getPlayers(): Array<string> {
    return this.players;
  }

  setPlayers(player: string): void {
    if (this.players.length < 2) {
      this.players.push(player);
    }
  }

  setCurrentPlayer(): void {
    this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
  }

  writeSignToField(player: string, coords: Vector): void {
    if (this.players.length === 2) {
      if (!this.winner || !this.noMoves) {
        if (player === this.players[this.currentPlayerIndex]) {
          this.field[coords.y][coords.x] = this.signs[this.currentPlayerIndex];
          this.checkWinner(coords, this.signs[this.currentPlayerIndex]);
          this.currentSign = this.signs[this.currentPlayerIndex];
          const time = getTimeString(Math.floor((Date.now() - this.startTime) / 1000));
          this.moveCounter++;
          this.history.push({
            sign: this.currentSign,
            move: coords,
            time: time,
            player
          });
          this.setCurrentPlayer();
          if (this.moveCounter >= 9) {
            this.noMoves = !this.noMoves;
          }
        }
      }
    }
  }

  getField(): Array<Array<string>> {
    return this.field;
  }

  getWinner(): string {
    return this.winner;
  }

  checkWinner(coords: Vector, sign: string): void {
    let countHor = 1;
    let countVer = 1;
    let countDiagPrim = 1;
    let countDiagSec = 1;

    const { x: fromX, y: fromY } = coords;
    const moveHor = [ { x: -1, y: 0 }, { x: 1, y: 0 } ];
    const moveVer = [ { x: 0, y: 1 }, { x: 0, y: -1 } ];
    const moveDiagPrim = [ { x: -1, y: -1 }, { x: 1, y: 1 } ];
    const moveDiagSec = [ { x: -1, y: 1 }, { x: 1, y: -1 } ];

    moveHor.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          if (this.field[toY][toX] === sign) {
            countHor++;
          } else break;
        }
      }
    });

    moveVer.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          if (this.field[toY][toX] === sign) {
            countVer++;
          } else break;
        }
      }
    });

    moveDiagPrim.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          if (this.field[toY][toX] === sign) {
            countDiagPrim++;
          } else break;
        }
      }
    });

    moveDiagSec.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          if (this.field[toY][toX] === sign) {
            countDiagSec++;
          } else break;
        }
      }
    });
    if (countHor === size || countVer === size || countDiagPrim === size || countDiagSec === size) {
      this.winner = this.players[this.currentPlayerIndex];
      console.log(`Win! The player ${this.players[this.currentPlayerIndex]} wins the game`);
    }
  }

  clearData(): void {
    this.field = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];
    this.players = [];
    this.currentPlayerIndex = 0;
    this.winner = '';
    this.history = [];
    this.startTime = 0;
    this.moveCounter = 0;
    this.noMoves = false;
  }

  getCurrentSign(): string {
    return this.currentSign;
  }

  getCurrentPlayer(): string {
    return this.players[this.currentPlayerIndex];
  }

  getGameMode(): string {
    return this.gameMode;
  }

  getHistory(): ICrossHistory {
    return this.history[this.history.length - 1];
  }

  startGame(time: number): void {
    this.startTime = time;
  }

  getFullHistory(): Array<ICrossHistory> {
    return this.history;
  }

  getNoMove(): boolean {
    return this.noMoves;
  }
}

function getTimeString(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minOutput}:${secOutput}`;
}
