import SessionModel from '../dataModels/sessionModel';
import UserModel from '../dataModels/userModel';

interface IDatabaseUser {
  login: string;
  password: string;
  avatar: string;
}

interface IChatResponse {
  type: string;
}

export interface IChatUser {
  userName: string;
  avatar: string;
}

class ChatUserData {
  public login: string;
  public avatar: string;
  public sessionId: string;

  constructor(sessionId: string, data: IDatabaseUser) {
    this.sessionId = sessionId;
    this.login = data.login;
    this.avatar = data.avatar;
  }
}

class ChatClient {
  public connection: any;
  public userData: ChatUserData;

  constructor(connection: any, userData: ChatUserData) {
    this.connection = connection;
    this.userData = userData;
  }

  send(response: IChatResponse) {
    this.connection.sendUTF(JSON.stringify(response));
  }
}

// class ChannelUserListResponse implements IChatResponse{
//   public type:string;
//   public userList: Array<string>;
//   public service:string;
//   public params: {
//     userList: Array<string>
//   }

//   constructor(userList:Array<string>){
//     this.service = 'chat',
//     this.type = 'userList';
//     this.params = {
//       userList: [...userList]
//     }

//   }
// }

class ChannelUserListResponse implements IChatResponse {
  public type: string;
  // public userList: Array<string>;
  public service: string;
  public params: {
    userList: Array<{ userName: string; avatar: string }>;
  };

  constructor(userList: Array<{ userName: string; avatar: string }>) {
    (this.service = 'chat'), (this.type = 'userList');
    this.params = {
      userList: [ ...userList ]
    };
  }
}

class ChannelSendMessageResponse implements IChatResponse {
  public type: string;
  public service: string;
  public params: {
    senderNick: string;
    messageText: string;
    avatar: string;
  };

  constructor(senderNick: string, messageText: string, avatar = '') {
    (this.service = 'chat'), (this.type = 'message');
    this.params = { senderNick, messageText, avatar };
  }
}

class ChannelJoinUserResponse implements IChatResponse {
  public type: string;
  public service: string;
  public requestId: number;
  public params: {
    status: string;
  };

  constructor(status: string, requestId: number) {
    this.service = 'chat';
    this.type = 'joined';
    this.requestId = requestId;
    this.params = { status };
  }
}

class ChannelPlayerListResponse implements IChatResponse {
  public type: string;
  public service: string;
  public params: {
    playerList: Array<{ login: string; avatar: string }>;
  };

  constructor(playerList: Array<{ login: string; avatar: string }>) {
    (this.service = 'chat'), (this.type = 'playerList');
    this.params = {
      playerList: [ ...playerList ]
    };
  }
}

export class ChatChannel {
  public name: string;
  public clients: Array<ChatClient>;
  public players: Array<{ login: string; avatar: string }>;
  public type: string;

  constructor(name: string, type: string) {
    this.name = name;
    this.clients = [];
    this.type = type;
  }

  private _sendForAllClients(response: IChatResponse) {
    this.clients.forEach((client) => {
      client.send(response);
    });
  }

  hasUser(connection) {
    return this.clients.findIndex((client) => client.connection == connection) == -1 ? false : true;
  }

  async joinUser(connection: any, params: any) {
    try {
      const sessionModel = await SessionModel.buildBySessionHash(params.sessionId /*'inikon359'*/);
      const userModel = await UserModel.buildByLogin(sessionModel.login);
      if (userModel && !this.hasUser(connection)) {
        const newClient = new ChatClient(connection, new ChatUserData(params.sessionId, userModel));
        this.clients.push(newClient);
        newClient.send(new ChannelJoinUserResponse('ok', params.requestId));
        this._sendForAllClients(
          new ChannelUserListResponse(
            this.clients.map((it) => ({ userName: it.userData.login, avatar: it.userData.avatar }))
          )
        );
        this._sendForAllClients(
          new ChannelPlayerListResponse(
            this.players.map((it) => ({ login: it.login, avatar: it.avatar }))
          )
        );
      } else {
        throw new Error('err');
      }
    } catch (err) {
      connection.sendUTF(JSON.stringify(new ChannelJoinUserResponse('error', params.requestId)));
      //send respons for user
    }
  }

  leaveUser(connection, params) {
    const currentClient = this.clients.find((it) => it.connection == connection);
    this.clients = this.clients.filter((it) => it.connection != connection);
    if (this.players && this.players.length) {
      this.players = this.players.filter((it) => it.login != currentClient.userData.login);
    }
    this.clients.forEach((it) => {
      // this._sendForAllClients(new ChannelUserListResponse(this.clients.map(it => it.userData.login)));
      this._sendForAllClients(
        new ChannelUserListResponse(
          this.clients.map((it) => ({ userName: it.userData.login, avatar: it.userData.avatar }))
        )
      );
      if (this.players && this.players.length) {
        this._sendForAllClients(
          new ChannelPlayerListResponse(
            this.players.map((it) => ({ login: it.login, avatar: it.avatar }))
          )
        );
      }
    });
  }

  sendMessage(connection, params) {
    console.log(params);
    const currentClient = this.clients.find((it) => it.connection == connection);
    if (currentClient && currentClient.userData) {
      this._sendForAllClients(
        new ChannelSendMessageResponse(
          currentClient.userData.login,
          params.messageText,
          currentClient.userData.avatar
        )
      );
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
}
