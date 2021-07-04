import {ChatChannel} from './socketChannel';
import { connection } from 'websocket';

function createChannel(type:string, params:any):ChatChannel {
  return new {ChatChannel}[type](params);
}

export class LobbyService{
  readonly serviceName = 'chat';
  private channels: Array<ChatChannel>;

  constructor(){
    this.channels = [];
  }

  sendToChannel(userConnection:connection, params:any){
    const foundChannel = this.channels.find(channel => channel.name == params.channelName);
    if (foundChannel){
      foundChannel[params.channelMethod](userConnection, params.channelRequestParams);
    }
  }

  createNewChannel(userConnection:connection, params:any){
    const foundChannel = this.channels.find(channel => channel.name == params.channelName);
    if (!foundChannel){
      const newChannel = createChannel(params.channelType, params.channelParams)
      this.channels.push(newChannel);
    }  
  }

}