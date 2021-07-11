const socketURL = 'ws://localhost:4080';
import {ISocketService} from './ISocketService';
import {LobbyService, LobbyModel, LobbyView} from './lobbyService';
import {OnlyChatChannelService, OnlyChatChannelModel, OnlyChatChannelView} from './onlyChatChannel/onlyChatChannel';
import Signal from './signal';


export class SocketClient{
  socket: WebSocket = null;

  services: Array<ISocketService>;
  url:string;

  public onOpen: Signal<void> = new Signal();
  public onClose: Signal<void> = new Signal();

  constructor(){
    this.services = [];
  }

  messageHandler(message:MessageEvent){
    this.services.forEach(service => {
      service.messageHandler(message.data);
    });
  }

  closeHandler(){
    this.onClose.emit();
    this.socket = null;
    this.services.forEach(service => {
      service.closeHandler();
    });
  }

  openHandler(){
    this.onOpen.emit();
    this.services.forEach(service => {
      service.openHandler();
    });
    console.log('WebSocket opened.')
  }

  async init(url:string){
    this.url = url;
    return new Promise((resolve, reject)=>{
      const socket = new WebSocket(url);
      socket.onopen = () => {
        this.socket = socket;
        resolve(this);
        this.openHandler();
      };

      socket.onmessage = (message) => {
        this.messageHandler(message);
      }

      socket.onclose = () => {
        this.closeHandler();
      }

    });
  }

  async reconnent(){
    return this.init(this.url);
  }

  addService(serviceInstance: ISocketService){
    this.services.push(serviceInstance);
    serviceInstance.attachClient({
      onSend: (message) => {
        this.send(message);
      },
      onRemove: () => {
        this.removeService(serviceInstance);
      }
    });
  }

  removeService(serviceInstance: ISocketService){
    serviceInstance.unattachClient();
    this.services = this.services.filter(service => service!==serviceInstance);
  }

  send(message:Object){
    this.socket.send(JSON.stringify(message));
  }
}

// (async function test() {
//   let socket = new SocketClient();
  
//   let lobbyModel = new LobbyModel(socket);
//   let lobby = new LobbyView(document.body, lobbyModel);

//   lobby.onJoinClick = ()=>{
//     let onlyChatChannelModel = new OnlyChatChannelModel(socket, 'dgh');
//     onlyChatChannelModel.joinChannel().then(res=>{
//       console.log('join channel', res);
//       if (res){
//         let channel = new OnlyChatChannelView(document.body, onlyChatChannelModel);
//         channel.onLeaveClick = ()=>{
//           channel.destroy();
//         }
//       }
//     });
    
//   }

//   socket.init(socketURL);
//   /*lobbyModel.createNewChannel('fgdfs').then((params)=>{
//     console.log('created ', params);
//   });*/
// })();