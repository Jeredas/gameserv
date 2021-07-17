import { ChatChannel } from '../../socketChannel';
import Vector from '../../../utils/vector';
import { writeStatistic } from '../../../httpServices/statService';
import CrossRemoveResponse from './crossSupport/crossRemoveResponse';
import CrossStartResponse from './crossSupport/crossStartResponse';
import CrossMoveResponse from './crossSupport/crossMoveResponse';
import CrossDrawResponse from './crossSupport/crossDrawResponse';
import CrossDrawAgreeResponse from './crossSupport/crossDrawAgreeResponse';
import CrossNoMovesResponse from './crossSupport/crossNoMovesResponse';
import CrossGameLogic from '../../../cross-lib/crossGame';
import ChannelJoinPlayerResponse from '../../channelSupport/channelJoinPlayerResponse';
import ChannelPlayerListResponse from '../../channelSupport/channelPlayerListResponse';
import ChannelSendPlayersResponse from '../../channelSupport/channelSendPlayersResponse';
import IChatResponse from '../../channelSupport/channelInterfaces';
import CrossRenewResponse from './crossSupport/crossRenewResponse';

export interface ICrossHistory {
  sign: string;
  move: Vector;
  time: string;
  player: string;
}

export class CrossGameChannel extends ChatChannel {
  logic: CrossGameLogic;
  players: Array<{ login: string; avatar: string }>;
  history: Array<ICrossHistory>;
  recordData: {
    history: ICrossHistory[];
    player1: { login: string; avatar: string };
    player2: { login: string; avatar: string };
    date: string;
    time: string;
    winner: string;
    gameType: string;
    gameMode: string;
  };

  constructor(name: string, type: string, params: any) {
    super(name, type, params);
    console.log('created CrossGameChannel');
    this.logic = new CrossGameLogic();
    this.players = [];
    this.history = [];
    this.recordData = null;
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
            this.players.map((it) => ({ login: it.login, avatar: it.avatar })),
            true
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
      let currentPlayer = currentClient.userData.login;
      if (this.players.find((player) => player.login === currentPlayer)) {
        const rivalPlayer = this.logic.getPlayers().find((player) => player !== currentPlayer);
        if (rivalPlayer) { 
          let rivalClient = this._getUserByLogin(rivalPlayer);
          this.players = this.players.filter((it) => it.login != currentClient.userData.login);
          if (rivalClient) {
            currentClient.send(new CrossRemoveResponse(this.name, 'lost', rivalPlayer));
            rivalClient.send(new CrossRemoveResponse(this.name, 'won', currentPlayer));
          }
        }
        this._sendForAllClients(
          new ChannelPlayerListResponse(
            this.name,
            this.players.map((it) => ({ login: it.login, avatar: it.avatar })),
            true
          )
        );
        this.history = this.logic.getFullHistory();
        this.logic.clearData();
        this.players = [];
      }
    }
    super.leaveUser(connection, params);
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
        const checkPlayer = this.players.find((player) => player.login === currentPlayer);
        if (checkPlayer) {
          const rivalPlayer = this.logic.getPlayers().find((player) => player !== currentPlayer);
          let rivalClient = this._getUserByLogin(rivalPlayer);
          if (params.messageText === 'loss') {
            currentClient.send(new CrossRemoveResponse(this.name, 'lost', rivalPlayer));
            rivalClient.send(new CrossRemoveResponse(this.name, 'won', currentPlayer));
            writeStatistic(this.getRecordData());
            this.logic.clearData();
            this.players = [];
            this.sendForAllClients(new CrossRenewResponse(this.name));
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
            rivalClient.send(responseDrawAgree);
            currentClient.send(responseDraw);
          }
        }
      }
    }
  }

  crossRemove(connection, params) {
    let currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentPlayer = currentClient.userData.login;
      const checkPlayer = this.players.find((player) => player.login === currentPlayer);
      if (checkPlayer) {
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
          console.log('write from crossRemove');
          
        }
        writeStatistic(this.getRecordData());
          this.logic.clearData();
          this.players = [];
          this.sendForAllClients(new CrossRenewResponse(this.name));
      }
    }
  }

  crossWinnerResponse(connection, params) {
    let currentClient = this._getUserByConnection(connection);
    if (currentClient) {
      let currentPlayer = currentClient.userData.login;
      const rivalPlayer = this.logic.getPlayers().find((player) => player !== currentPlayer);
      let rivalClient = this._getUserByLogin(rivalPlayer);
      if (this.logic.getWinner()) {
        if (currentPlayer === this.logic.getWinner()) {
          currentClient.send(new CrossRemoveResponse(this.name, 'won', rivalPlayer));
          rivalClient.send(new CrossRemoveResponse(this.name, 'lost', currentPlayer));
        } else {
          currentClient.send(new CrossRemoveResponse(this.name, 'lost', rivalPlayer));
          rivalClient.send(new CrossRemoveResponse(this.name, 'won', currentPlayer));
        }
      } else {
        const response = new CrossNoMovesResponse(this.name);
        currentClient.send(response);
        rivalClient.send(response);
        this.sendForAllClients(new CrossRenewResponse(this.name));

        // this.clients.forEach((it) =>
        //   it.connection.sendUTF(JSON.stringify(new CrossNoMovesResponse(this.name)))
        // );
      }
      writeStatistic(this.getRecordData());
      this.logic.clearData();
      this.players = [];
    }
  }
  getRecordData() {
    let date = new Date();
    return (this.recordData = {
      history: this.logic.getFullHistory(),
      player1: this.players[0],
      player2: this.players[1],
      date: `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`,
      time: `${this.logic.getFullHistory()[this.logic.getFullHistory().length - 1].time}`,
      winner: this.logic.getWinner(),
      gameType: 'CROSS',
      gameMode: this.gameMode
    });
  }
}
