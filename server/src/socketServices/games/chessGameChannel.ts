import { CellCoord } from './../../chess-lib/cell-coord';
import { ChatChannel } from '../socketChannel';
import Vector from '../../utils/vector';
import { IChessProcessor } from '../../chess-lib/ichess-processor';
import { ChessProcessor } from '../../chess-lib/chess-processor';
import { ChessColor } from '../../chess-lib/chess-color';
import { Move } from '../../chess-lib/move';
import { time } from 'console';
import { ICellCoord } from '../../chess-lib/icell-coord';
import { Field } from '../../chess-lib/field';

interface IChatResponse {
  type: string;
}

interface IChessHistory {
  coords: Array<Vector>;
  time: number;
  figName: string;
}


interface IKingInfo {
    coords: Vector;
    rival: Array<Vector>;
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
    coords: string;
    history: IChessHistory;
    king: {
        check: IKingInfo | null;
        mate: boolean;
    };
  };

  constructor(
    channelName: string,
    player: string,
    field: string,
    coords: string,
    history: IChessHistory | null,
    king: {
        check: IKingInfo | null;
        mate: boolean;
    }
  ) {
    this.service = 'chat';
    this.type = 'chessMove';
    this.channelName = channelName;
    this.params = {
      player,
      field,
      coords,
      history,
      king
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
        } else if (this.gameMode === 'oneScreen') {
          if (this.players.length < 1) {
            this.players.push({
              login: currentClient.userData.login,
              avatar: currentClient.userData.avatar,
              color: ChessColor.white
            });
            this.players.push({
              login: currentClient.userData.login,
              avatar: currentClient.userData.avatar,
              color: ChessColor.black
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
        if (this.players.length) {
          this._sendForAllClients(
            new ChannelPlayerListResponse(
              this.name,
              this.players.map((it) => ({ login: it.login, avatar: it.avatar }))
            )
          );
        }
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

  leaveChessChannel(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    this.clients = this.clients.filter((it) => it.connection != connection);

    if (this.players && this.players.length) {
      let currentPlayer = currentClient.userData.login;
      const rivalPlayer = this.players.find((player) => player.login !== currentPlayer).login;
      let rivalClient = this._getUserByLogin(rivalPlayer);
      this.players = this.players.filter((it) => it.login != currentClient.userData.login);
      if (rivalClient) {
        currentClient.send(new ChessRemoveResponse(this.name, 'lost', rivalPlayer));
        rivalClient.send(new ChessRemoveResponse(this.name, 'won', currentPlayer));
      }
      this._sendForAllClients(
        new ChannelPlayerListResponse(
          this.name,
          this.players.map((it) => ({ login: it.login, avatar: it.avatar }))
        )
      );
      // this.history = this.logic.getFullHistory();
      // this.logic.clearData();
      this.chessProcessor.clearData();
      this.players = [];
    }
    super.leaveUser(connection, params);
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
        if (
          this.players.filter((player) => player.color == this.chessProcessor.getPlayerColor())[0]
            .login == currentUser.login
        ) {
          let coords = JSON.parse(params.messageText);
          const startCoord = new CellCoord(coords[0].x, coords[0].y);
          const targetCoord = new CellCoord(coords[1].x, coords[1].y);
          const figure = this.chessProcessor.getFigureStr(startCoord);
          const moveAllowed = this.chessProcessor.makeMove(startCoord, targetCoord);
          console.log(
            'MOVE: ',
            startCoord.toString() + '-' + targetCoord.toString(),
            moveAllowed ? '[OK]' : '[ERROR]'
          );
          console.log('\tposition: ', this.chessProcessor.getField());
          let historyItem: IChessHistory | null;
          if (!moveAllowed) {
            historyItem = null;
          } else {
            const history = this.chessProcessor.getHistory();
            const historyLastEl = history[history.length - 1];
            const moveCoords = new Array<Vector>();
            moveCoords.push(new Vector(startCoord.x, startCoord.y));
            moveCoords.push(new Vector(targetCoord.x, targetCoord.y));
            historyItem = {
              time: historyLastEl.time - this.chessProcessor.getStartTime(),
              figName: figure,
              coords: moveCoords
            };
          }
          const kingPos = this.chessProcessor.getKingPos();
          const kingRivals = this.chessProcessor.getKingRivals();
          let checkModel: {coords: Vector, rival: Array<Vector>} | null ;
          let isMate: boolean;
          if (kingRivals.size !== 0) {
            const rivals = new Array<Vector>();
            for(let rival of kingRivals) {
              const rivalCoord = CellCoord.fromString(rival);
              rivals.push(new Vector(rivalCoord.x, rivalCoord.y));
            }
            checkModel = {
              coords: new Vector(kingPos.x, kingPos.y),
              rival: rivals
            }
            isMate = this.chessProcessor.isMate();
            if (isMate) {
              console.log('!!!MATE!!! Winner is ', (this.chessProcessor.getPlayerColor() == ChessColor.white) ? 'black' : 'white');
            }
          } else { 
            checkModel = null;
            isMate = false;
          }
          const king = {
            // check: {
            //   coords: new CellCoord(4, 0),
            //   rival: [ new CellCoord(3, 1), new CellCoord(2, 2), new CellCoord(1, 3) ]
            // },
            check: checkModel,
            mate: isMate
          };
          console.log('KING: ', king);
          const response = new ChessMoveResponse(
            this.name,
            currentUser.login,
            this.chessProcessor.getField(),
            // this.logic.getWinner(),
            // this.logic.getHistory()
            params.messageText,
            historyItem,
            king
          );
          // this.clients.forEach((it) => it.connection.sendUTF(JSON.stringify(response)));
          this.sendForAllClients(response);
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
      if (
        this.players.filter((player) => player.color == this.chessProcessor.getPlayerColor())[0]
          .login == currentUser.login
      ) {
        const coord = JSON.parse(params.messageText);
        const moves = this.chessProcessor.getMoves(new CellCoord(coord.x, coord.y));
        const allowed = new Array<Vector>();
        const log = Array<string>();
        for (let move of moves) {
          let target = move.getTargetCell();
          allowed.push(new Vector(target.x, target.y));
          log.push(move.toString());
        }
        console.log('GRAB: ', log.join(' '));
        const response = new ChessGrabResponse(this.name, allowed);
        currentClient.send(response);
        // this.sendForAllClients(response);
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
