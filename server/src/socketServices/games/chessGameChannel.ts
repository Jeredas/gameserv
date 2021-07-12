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
    const currentClient = this._getUserByConnection(connection);
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

// let size = 3;
// export class ChessGameLogic {
//   private field: Array<Array<string>> = [];
//   private players: Array<string> = [];
//   private currentPlayerIndex: number = 0;
//   private signs: Array<string> = [ 'X', 'O' ];
//   private winner: string = '';
//   private currentSign: string = this.signs[0];
//   private gameMode: string = 'network';
//   private startTime: number = 0;

//   constructor() {
//     this.field = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];
//   }
//   getPlayers(): Array<string> {
//     return this.players;
//   }

//   setPlayers(player: string): void {
//     if (this.players.length < 2) {
//       this.players.push(player);
//     }
//   }

//   setCurrentPlayer(): void {
//     this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
//   }

//   writeSignToField(player: string, coords: Vector): void {
//     if (this.players.length === 2) {
//       if (!this.winner) {
//         if (player === this.players[this.currentPlayerIndex]) {
//           this.field[coords.y][coords.x] = this.signs[this.currentPlayerIndex];
//           this.checkWinner(coords, this.signs[this.currentPlayerIndex]);
//           this.currentSign = this.signs[this.currentPlayerIndex];
//           this.setCurrentPlayer();
//           const time = getTimeString(Math.floor((Date.now() - this.startTime) / 1000));
//         }
//       }
//     }
//   }

//   getField(): Array<Array<string>> {
//     return this.field;
//   }

//   getWinner(): string {
//     return this.winner;
//   }

//   checkWinner(coords: Vector, sign: string): void {
//     let countHor = 1;
//     let countVer = 1;
//     let countDiagPrim = 1;
//     let countDiagSec = 1;

//     const { x: fromX, y: fromY } = coords;
//     const moveHor = [ { x: -1, y: 0 }, { x: 1, y: 0 } ];
//     const moveVer = [ { x: 0, y: 1 }, { x: 0, y: -1 } ];
//     const moveDiagPrim = [ { x: -1, y: -1 }, { x: 1, y: 1 } ];
//     const moveDiagSec = [ { x: -1, y: 1 }, { x: 1, y: -1 } ];

//     moveHor.forEach((move) => {
//       let toX = fromX;
//       let toY = fromY;
//       for (let i = 0; i < size; i++) {
//         toX += move.x;
//         toY += move.y;
//         if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
//           if (this.field[toY][toX] === sign) {
//             countHor++;
//           } else break;
//         }
//       }
//     });

//     moveVer.forEach((move) => {
//       let toX = fromX;
//       let toY = fromY;
//       for (let i = 0; i < size; i++) {
//         toX += move.x;
//         toY += move.y;
//         if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
//           if (this.field[toY][toX] === sign) {
//             countVer++;
//           } else break;
//         }
//       }
//     });

//     moveDiagPrim.forEach((move) => {
//       let toX = fromX;
//       let toY = fromY;
//       for (let i = 0; i < size; i++) {
//         toX += move.x;
//         toY += move.y;
//         if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
//           if (this.field[toY][toX] === sign) {
//             countDiagPrim++;
//           } else break;
//         }
//       }
//     });

//     moveDiagSec.forEach((move) => {
//       let toX = fromX;
//       let toY = fromY;
//       for (let i = 0; i < size; i++) {
//         toX += move.x;
//         toY += move.y;
//         if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
//           if (this.field[toY][toX] === sign) {
//             countDiagSec++;
//           } else break;
//         }
//       }
//     });
//     if (countHor === size || countVer === size || countDiagPrim === size || countDiagSec === size) {
//       this.winner = this.players[this.currentPlayerIndex];
//       console.log(`Win! The player ${this.players[this.currentPlayerIndex]} wins the game`);
//     }
//   }

//   clearData(): void {
//     this.field = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];
//     this.players = [];
//     this.currentPlayerIndex = 0;
//     this.winner = '';
//     this.startTime = 0;
//   }

//   getCurrentSign(): string {
//     return this.currentSign;
//   }

//   getCurrentPlayer(): string {
//     return this.players[this.currentPlayerIndex];
//   }

//   getGameMode(): string {
//     return this.gameMode;
//   }

//   getHistory(): string {
//     return 'history';
//   }

//   startGame(time: number): void {
//     this.startTime = time;
//   }

//   getFullHistory(): Array<string> {
//     return [ 'hustory' ];
//   }
// }

function getTimeString(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minOutput}:${secOutput}`;
}
