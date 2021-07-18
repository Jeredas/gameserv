import { CellCoord } from '../../../chess-lib/cell-coord';
import { ChatChannel } from '../../socketChannel';
import Vector from '../../../utils/vector';
import { IChessProcessor } from '../../../chess-lib/ichess-processor';
import { ChessProcessor } from '../../../chess-lib/chess-processor';
import { ChessColor } from '../../../chess-lib/chess-color';
import { writeStatistic } from '../../../httpServices/statService';
import { IHistoryItem } from '../../../chess-lib/ihistory-item';
import ChannelJoinPlayerResponse from '../../channelSupport/channelJoinPlayerResponse';
import ChannelPlayerListResponse from '../../channelSupport/channelPlayerListResponse';
import ChannelSendPlayersResponse from '../../channelSupport/channelSendPlayersResponse';
import ChessStartResponse from './chessSupport/chessStartResponse';
import ChessMoveResponse from './chessSupport/chessMoveResponse';
import IChessHistory, { IPlayerData } from './chessSupport/chessInterfaces';
import IChatResponse from '../../channelSupport/channelInterfaces';
import ChessGrabResponse from './chessSupport/chessGrabResponse';
import ChessRecommendedResponse from './chessSupport/chessRecommendedResponse';
import ChessDrawResponse from './chessSupport/chessDrawResponse';
import ChessDrawAgreeResponse from './chessSupport/chessDrawAgreeResponse';
import ChessRenewResponse from './chessSupport/chessRenewResponse';
import ChessRemoveResponse from './chessSupport/chessRemoveResponse';
import ChessMateResponse from './chessSupport/chessMateResponse';
import ChessStaleMateResponse from './chessSupport/chessStaleMateResponse';
import ChessPlayer from './chessSupport/chessPlayer';

export class ChessGameChannel extends ChatChannel {
  gameMode: string;
  chessProcessor: IChessProcessor;
  players: Array<IPlayerData>;
  recordData: {
    history: IHistoryItem[];
    player1: IPlayerData;
    player2: IPlayerData;
    date: string;
    time: string;
    winner: string;
    gameType: string;
    gameMode: string;
    moves: Array<{ field: string; player: string; history: IChessHistory }>;
  };
  moves: Array<{ field: string; player: string; history: IChessHistory }>;

  constructor(name: string, type: string, params: any) {
    super(name, type, params);
    this.chessProcessor = new ChessProcessor();
    this.players = new Array<IPlayerData>();
    this.gameMode = params.gameMode;
    this.moves = [];
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
            // this.players.push({
            //   login: currentClient.userData.login,
            //   avatar: currentClient.userData.avatar,
            //   color: this.players.length == 0 ? ChessColor.white : ChessColor.black
            // });
            this.players.push(
              new ChessPlayer(
                currentClient.userData.login,
                currentClient.userData.avatar,
                this.players.length == 0 ? ChessColor.white : ChessColor.black
              )
            );
          }
        } else if (this.gameMode === 'oneScreen') {
          if (this.players.length < 1) {
            // this.players.push({
            //   login: currentClient.userData.login,
            //   avatar: currentClient.userData.avatar,
            //   color: ChessColor.white
            // });
            // this.players.push({
            //   login: currentClient.userData.login,
            //   avatar: currentClient.userData.avatar,
            //   color: ChessColor.black
            // });
            this.players.push(
              new ChessPlayer(
                currentClient.userData.login,
                currentClient.userData.avatar,
                ChessColor.white
              )
            );
            this.players.push(
              new ChessPlayer(
                currentClient.userData.login,
                currentClient.userData.avatar,
                ChessColor.black
              )
            );
          }
        } else if (this.gameMode === 'bot') {
          if (this.players.length < 1) {
            // this.players.push({
            //   login: currentClient.userData.login,
            //   avatar: currentClient.userData.avatar,
            //   color: ChessColor.white
            // });
            // this.players.push({
            //   login: 'AI',
            //   avatar: currentClient.userData.avatar,
            //   color: ChessColor.black
            // });
            this.players.push(
              new ChessPlayer(
                currentClient.userData.login,
                currentClient.userData.avatar,
                ChessColor.white
              )
            );
            this.players.push(new ChessPlayer('AI', '', ChessColor.black));
          }
        } else {
          throw new Error('ChessGameChanel.joinPlayer(): Illegal game mode');
        }
        const response = new ChannelJoinPlayerResponse(this.name, 'ok', params.requestId);
        currentClient.send(response);
        if (this.players.length) {
          this._sendForAllClients(
            new ChannelPlayerListResponse(
              this.name,
              this.players.map((it) => ({ login: it.login, avatar: it.avatar })),
              false
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
      if (this.players.find((player) => player.login === currentPlayer)) {
        if (this.gameMode === 'network') {
          const rivalPlayer = this.players.find((player) => player.login !== currentPlayer);
          if (rivalPlayer) {
            let rivalClient = this._getUserByLogin(rivalPlayer.login);
            this.players = this.players.filter((it) => it.login != currentClient.userData.login);
            if (rivalClient) {
              currentClient.send(new ChessRemoveResponse(this.name, 'lost', rivalPlayer.login));
              rivalClient.send(new ChessRemoveResponse(this.name, 'won', currentPlayer));
            }
          }
        }
        const response = new ChannelPlayerListResponse(
          this.name,
          this.players.map((it) => ({ login: it.login, avatar: it.avatar })),
          true
        );
        this._sendForAllClients(response);
        this.chessProcessor.clearData();
        this.players = [];
      }
    }
    super.leaveUser(connection, params);
  }
  chessStartGame(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser.login === params.messageText) {
        this.chessProcessor.startGame();
        const response = new ChessStartResponse(
          this.name,
          this.chessProcessor.getStartTime(),
          this.chessProcessor.getField()
        );
        this.sendForAllClients(response);
      }
    }
  }

  chessMove(connection, params, bot = false) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser) {
        if (
          this.players.filter((player) => player.color == this.chessProcessor.getPlayerColor())[0]
            .login == currentUser.login ||
          bot
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
            const move = {
              field: this.chessProcessor.getField(),
              player: currentUser.login,
              history: historyItem
            };
            this.moves.push(move);
          }

          const kingPos = this.chessProcessor.getKingPos();
          const kingRivals = this.chessProcessor.getKingRivals();
          let checkModel: { coords: Vector; rival: Array<Vector> } | null;
          let isMate: boolean;
          let isStaleMate: boolean;
          if (kingRivals.size !== 0) {
            const rivals = new Array<Vector>();
            for (let rival of kingRivals) {
              const rivalCoord = CellCoord.fromString(rival);
              rivals.push(new Vector(rivalCoord.x, rivalCoord.y));
            }
            checkModel = {
              coords: new Vector(kingPos.x, kingPos.y),
              rival: rivals
            };
            isMate = this.chessProcessor.isMate();
            isStaleMate = false;
            if (isMate) {
              console.log(
                '!!!MATE!!! Winner is ',
                this.chessProcessor.getPlayerColor() == ChessColor.white ? 'black' : 'white'
              );
            }
          } else {
            checkModel = null;
            isMate = false;
            isStaleMate = this.chessProcessor.isStaleMate();
            if (isStaleMate) {
              console.log('!!!STALEMATE!!! Draw');
            }
          }
          const king = {
            check: checkModel,
            mate: isMate,
            staleMate: isStaleMate
          };
          console.log('KING: ', king);
          const response = new ChessMoveResponse(
            this.name,
            currentUser.login,
            this.chessProcessor.getField(),
            params.messageText,
            historyItem,
            king
          );

          this.sendForAllClients(response);
          if (!bot && this.gameMode === 'bot' && moveAllowed && !isMate && !isStaleMate) {
            const botMove = this.chessProcessor.getRecommendMove();
            if (botMove !== null) {
              const startBotCoord = botMove.startCell;
              const targetBotCoord = botMove.getTargetCell();
              const resultMove = new Array<Vector>();
              resultMove.push(new Vector(startBotCoord.x, startBotCoord.y));
              resultMove.push(new Vector(targetBotCoord.x, targetBotCoord.y));
              params.messageText = JSON.stringify(resultMove);
              this.chessMove(connection, params, true);
            }
          }
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

  moveRecommend(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (
        this.players.filter((player) => player.color == this.chessProcessor.getPlayerColor())[0]
          .login == currentUser.login
      ) {
        // const recommended = [ new Vector(4, 6), new Vector(4, 4) ];
        const recommended = new Array<Vector>();
        const move = this.chessProcessor.getRecommendMove();
        console.log('MOVE RECOMMEND: ', move !== null ? move.toString() : 'none');
        if (move !== null) {
          const targetCell = move.getTargetCell();
          recommended.push(new Vector(move.startCell.x, move.startCell.y));
          recommended.push(new Vector(targetCell.x, targetCell.y));
        }
        const response = new ChessRecommendedResponse(this.name, recommended);
        currentClient.send(response);
      }
    }
  }

  chessStop(connection, params) {
    const currentClient = this.clients.find((it) => it.connection == connection);
    if (currentClient) {
      let currentUser = currentClient.userData;
      if (currentUser.login) {
        let currentPlayer = currentClient.userData.login;
        if (this.gameMode === 'network') {
          const checkPlayer = this.players.find((player) => player.login === currentPlayer);
          if (checkPlayer) {
            const rivalPlayer = this.players.find((player) => player.login !== currentPlayer).login;
            let rivalClient = this._getUserByLogin(rivalPlayer);
            if (params.messageText === 'loss') {
              currentClient.send(new ChessRemoveResponse(this.name, 'lost', rivalPlayer));
              rivalClient.send(new ChessRemoveResponse(this.name, 'won', currentPlayer));
              writeStatistic(this.getRecordData(currentPlayer));
              this.chessProcessor.clearData();
              this.players = [];
              this.sendForAllClients(new ChessRenewResponse(this.name));
            } else {
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
              rivalClient.send(responseDrawAgree);
              currentClient.send(responseDraw);
            }
          }
        } else {
          if (currentUser.login === this.players[1].login) {
            let rivalPlayer = 'Player2';
            if (this.gameMode === 'bot') {
              rivalPlayer = this.players[1].login;
            }
            if (params.messageText === 'loss') {
              currentClient.send(new ChessRemoveResponse(this.name, 'lost', rivalPlayer));
              writeStatistic(this.getRecordData('AI'));
            } else if (params.messageText === 'draw') {
              currentClient.send(new ChessRemoveResponse(this.name, 'draw', rivalPlayer));
              writeStatistic(this.getRecordData('draw'));
            }
            this.chessProcessor.clearData();
            this.players = [];
            this.sendForAllClients(new ChessRenewResponse(this.name));
          }
        }
      }
    }
  }

  chessMate(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentPlayer = currentClient.userData.login;
      if (currentPlayer) {
        if (this.players.length) {
          if (this.gameMode === 'network') {
            const rivalPlayer = this.players.find((player) => player.login !== currentPlayer).login;
            let rivalClient = this._getUserByLogin(rivalPlayer);
            currentClient.send(new ChessMateResponse(this.name, 'lost', rivalPlayer));
            rivalClient.send(new ChessMateResponse(this.name, 'won', currentPlayer));
            writeStatistic(this.getRecordData(currentPlayer));
            this.chessProcessor.clearData();
            this.players = [];
            this.moves =[];
            this.sendForAllClients(new ChessRenewResponse(this.name));
          } else {
            let rivalPlayer = 'Player2';
            if (this.gameMode === 'bot') {
              rivalPlayer = this.players[1].login;
            }
            const playerCurrent = this.chessProcessor.getPlayerColor();
            if (playerCurrent === 1) {
              currentClient.send(new ChessMateResponse(this.name, 'lost', rivalPlayer));
            } else {
              currentClient.send(new ChessMateResponse(this.name, 'won', rivalPlayer));
            }
            writeStatistic(this.getRecordData(rivalPlayer));
            this.chessProcessor.clearData();
            this.players = [];
            this.moves =[];
            this.sendForAllClients(new ChessRenewResponse(this.name));
          }
        }
      }
    }
  }

  chessStaleMate(connection, params) {
    const currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentPlayer = currentClient.userData.login;
      if (currentPlayer) {
        if (this.players.length) {
          const response = new ChessStaleMateResponse(this.name, 'staleMate');
          if (this.gameMode === 'network') {
            const rivalPlayer = this.players.find((player) => player.login !== currentPlayer).login;
            let rivalClient = this._getUserByLogin(rivalPlayer);
            currentClient.send(response);
            rivalClient.send(response);
            writeStatistic(this.getRecordData('StaleMate'));
            this.chessProcessor.clearData();
            this.players = [];
            this.moves =[];
            this.sendForAllClients(new ChessRenewResponse(this.name));
          } else {
            currentClient.send(response);
            writeStatistic(this.getRecordData('StaleMate'));
            this.chessProcessor.clearData();
            this.players = [];
            this.moves =[];
            this.sendForAllClients(new ChessRenewResponse(this.name));
          }
        }
      }
    }
  }

  chessRemove(connection, params) {
    let currentClient = this.clients.find((it) => it.connection == connection);
    if (currentClient) {
      let currentPlayer = currentClient.userData.login;
      if (this.gameMode === 'network') {
        const checkPlayer = this.players.find((player) => player.login === currentPlayer);
        if (checkPlayer) {
          const rivalPlayer = this.players.find((player) => player.login !== currentPlayer).login;
          let rivalClient = this._getUserByLogin(rivalPlayer);

          if (params.messageText === 'agree') {
            const response = new ChessRemoveResponse(this.name, 'draw');
            currentClient.send(response);
            rivalClient.send(response);
            writeStatistic(this.getRecordData('DRAW'));
          } else if (params.messageText === 'disagree') {
            currentClient.send(new ChessRemoveResponse(this.name, 'won', rivalPlayer));
            rivalClient.send(new ChessRemoveResponse(this.name, 'lost', currentPlayer));
            writeStatistic(this.getRecordData(rivalPlayer));
          }

          this.chessProcessor.clearData();
          this.players = [];
          this.sendForAllClients(new ChessRenewResponse(this.name));
        }
      }
    }
  }

  takePlayerOffGame(login): void {
    this.players = this.players.filter((player) => player.login !== login);
  }
  getRecordData(winner: string) {
    let time = '00:00:00';
    if(this.chessProcessor.getHistory().length >= 1){
      time = `${this.chessProcessor.getHistory()[this.chessProcessor.getHistory().length - 1].time}`
    }
     
    return (this.recordData = {
      history: this.chessProcessor.getHistory(),
      player1: this.players[0],
      player2: this.players[1],
      date: new Date().toLocaleDateString('ru'),
      time: time,
      winner: winner,
      gameType: 'CHESS',
      gameMode: this.gameMode,
      moves: this.moves? this.moves : []
    });
  }
  clearAll(){
    
  }
}
