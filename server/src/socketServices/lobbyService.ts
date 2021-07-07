import {ChatChannel} from './socketChannel';
import {OnlyChatChannel} from './games/onlyChatChannel';
import { connection } from 'websocket';
import {CrossGameChannel} from './games/crossGameChannel';
import {ChessGameChannel} from './games/chessGameChannel';

function createChannel(type:string, channelName, params:any):ChatChannel {
  return new ({OnlyChatChannel, CrossGameChannel, ChessGameChannel}[type])(channelName, type, params);
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
      console.log('foundChannel', foundChannel);
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
      const newChannel = createChannel(params.channelType, params.channelName, params.channelParams);
      this.channels.push(newChannel);
      userConnection.sendUTF(JSON.stringify({
        service: 'chat', 
        type: 'created', 
        params:{
          requestId: params.requestId,
          status: 'ok',
          channelType: params.channelType
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

  getChannelInfo(userConnection:connection, params:any){
    const foundChannel = this.channels.find(channel => channel.name == params.channelName);
    if (foundChannel){
      // foundChannel[params.channelMethod](userConnection, params.channelRequestParams);
      userConnection.sendUTF(JSON.stringify({
        service: 'chat', 
        type: 'channelType', 
        params:{
          requestId: params.requestId,
          status: 'ok',
          channelType: foundChannel.type,
          channelName: foundChannel.name
        }
      }));
      
      console.log('foundChannel', foundChannel);
      
    } else {
      userConnection.sendUTF(JSON.stringify({
        service: 'chat', 
        type: 'channelType', 
        params:{
          requestId: params.requestId,
          status: 'error',
          description: 'channel not found'
        }
      }));
    }
  }

}