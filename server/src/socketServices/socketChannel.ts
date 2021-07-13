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
  public service: string;
  public channelName: string;
  public params: {
    userList: Array<{ userName: string; avatar: string }>;
  };

  constructor(channelName: string, userList: Array<{ userName: string; avatar: string }>) {
    this.service = 'chat';
    this.type = 'userList';
    this.channelName = channelName;
    this.params = {
      userList: [ ...userList ]
    };
  }
}

class ChannelSendMessageResponse implements IChatResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    senderNick: string;
    messageText: string;
    avatar: string;
  };

  constructor(channelName: string, senderNick: string, messageText: string, avatar = '') {
    this.service = 'chat';
    this.type = 'message';
    this.channelName = channelName;
    this.params = { senderNick, messageText, avatar };
  }
}

class ChannelJoinUserResponse implements IChatResponse {
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

export class ChatChannel {
  public name: string;
  public clients: Array<ChatClient>;
  public players: Array<{ login: string; avatar: string }>;
  public type: string;
  public gameMode: string;

  constructor(name: string, type: string, params) {
    this.name = name;
    this.clients = [];
    this.type = type;
    this.gameMode = params.gameMode;
  }

  protected _sendForAllClients(response: IChatResponse) {
    this.clients.forEach((client) => {
      client.send(response);
    });
  }

  protected _hasUser(connection) {
    return this.clients.findIndex((client) => client.connection == connection) == -1 ? false : true;
  }

  protected _getUserByConnection(connection) {
    return this.clients.find((client) => client.connection == connection);
  }

  protected _getUserByLogin(login: string) {
    return this.clients.find((client) => client.userData.login === login);
  }

  async joinUser(connection: any, params: any) {
    try {
      const sessionModel = await SessionModel.buildBySessionHash(params.sessionId /*'inikon359'*/);
      const userModel = await UserModel.buildByLogin(sessionModel.login);
      if (userModel && !this._hasUser(connection)) {
        const newClient = new ChatClient(connection, new ChatUserData(params.sessionId, userModel));
        this.clients.push(newClient);
        newClient.send(new ChannelJoinUserResponse(this.name, 'ok', params.requestId));
        this._sendForAllClients(
          new ChannelUserListResponse(
            this.name,
            this.clients.map((it) => ({ userName: it.userData.login, avatar: it.userData.avatar }))
          )
        );
      } else {
        throw new Error('err');
      }
    } catch (err) {
      connection.sendUTF(
        JSON.stringify(new ChannelJoinUserResponse(this.name, 'error', params.requestId))
      );
      //send respons for user
    }
  }

  leaveUser(connection, params) {
    this.clients = this.clients.filter((it) => it.connection != connection);
    this.clients.forEach((it) => {
      this._sendForAllClients(
        new ChannelUserListResponse(
          this.name,
          this.clients.map((it) => ({ userName: it.userData.login, avatar: it.userData.avatar }))
        )
      );
    });
  }

  sendMessage(connection, params) {
    console.log(params);
    const currentClient = this._getUserByConnection(connection);
    if (currentClient && currentClient.userData) {
      this._sendForAllClients(
        new ChannelSendMessageResponse(
          this.name,
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
