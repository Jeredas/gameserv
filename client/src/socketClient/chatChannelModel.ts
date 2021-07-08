import { SocketClient } from './socketClient';
export class ChatChannelModel{
  channelName:string;
  socketClient: SocketClient;

  constructor(socketClient:SocketClient, channelName:string){
    this.channelName = channelName;
    this.socketClient = socketClient
  }
}