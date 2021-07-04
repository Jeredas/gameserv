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

  send(response: IChatResponse){
    this.connection.sendUTF(JSON.stringify(response));
  }
}

class ChannelJoinUserResponse implements IChatResponse{
  public type:string;
  public userList: Array<string>;

  constructor(userList:Array<string>){
    this.type = 'userList';
    this.userList = [...userList];
  }
}

class ChannelSendMessageResponse implements IChatResponse{
  public type:string;
  public senderNick:string;
  public messageText:string;

  constructor(senderNick:string, messageText:string){
    this.type = 'message';
    this.senderNick = senderNick,
    this.messageText = messageText;
  }
}

export class ChatChannel {
  public name: string;
  public clients: Array<ChatClient>

  constructor(name: string) {
    this.name = name;
    this.clients = [];
  }

  private _sendForAllClients(response: IChatResponse){
    this.clients.forEach(client => {
      client.send(response);
    });
  }

  async joinUser(connection: any, params: any) {
    try {
      const sessionModel = await SessionModel.buildBySessionHash(params.sessionId);
      const userModel = await UserModel.buildByLogin(sessionModel.login);
      if (userModel) {
        this.clients.push(new ChatClient(connection, new ChatUserData(params.sessionId, userModel)));
        this._sendForAllClients(new ChannelJoinUserResponse(this.clients.map(it => it.userData.login)));
      }
    } catch (err){
      //send respons for user
    }
  }

  leaveUser(connection, params) {
    this.clients = this.clients.filter(it => it.connection != connection);
    this.clients.forEach(it => {
      this._sendForAllClients(new ChannelJoinUserResponse(this.clients.map(it => it.userData.login)));
    });
  };

  sendMessage(connection, params) {
    const currentClient = this.clients.find(it => it.connection == connection);
    if (currentClient && currentClient.userData) {
      this._sendForAllClients(new ChannelSendMessageResponse(currentClient.userData.login, params.messageText));
    }
  }
}