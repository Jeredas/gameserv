import {ChatChannel} from './socketChannel';
import {OnlyChatChannel} from './games/onlyChatChannel';
import { connection } from 'websocket';

function createChannel(type:string, channelName, params:any):ChatChannel {
  return new ({OnlyChatChannel}[type])(channelName, params);
}

export class LobbyService{
  readonly serviceName = 'lobby';
  private channels: Array<ChatChannel>;

  constructor(){
    this.channels = [];
  }

  sendToChannel(userConnection:connection, params:any){
    const foundChannel = this.channels.find(channel => channel.name == params.channelName);
    if (foundChannel){
      foundChannel[params.channelMethod](userConnection, params.channelRequestParams);
    } else {
      userConnection.sendUTF(JSON.stringify({
        service: 'chat', 
        type: 'sendStatus', 
        params:{
          requestId: params.requestId,
          status: 'error',
          description: 'channel not found'
        }
      }));
    }
  }

  createNewChannel(userConnection:connection, params:any){
    const foundChannel = this.channels.find(channel => channel.name == params.channelName);
    if (!foundChannel){
      const newChannel = createChannel(params.channelType, params.channelName, params.channelParams)
      this.channels.push(newChannel);
      userConnection.sendUTF(JSON.stringify({
        service: 'chat', 
        type: 'created', 
        params:{
          requestId: params.requestId,
          status: 'ok'
        }
      }));
    }  else {
      userConnection.sendUTF(JSON.stringify({
        service: 'chat', 
        type: 'created', 
        params:{
          requestId: params.requestId,
          status: 'existed'
        }
      }));  
    }
    console.log(this.channels);
    
  }

  closeConnection(connection) {
    this.channels.forEach(channel => {
      channel.leaveUser(connection, {});
    });
  }

}