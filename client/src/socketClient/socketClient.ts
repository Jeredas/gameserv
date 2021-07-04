const socketURL = 'ws://localhost:4080';
import {ISocketService} from './ISocketService';
import {LobbyService} from './lobbyService';

export class SocketClient{
  socket: WebSocket = null;

  services: Array<ISocketService>;

  constructor(){

  }

  messageHandler(message:MessageEvent){
    this.services.forEach(service => {
      service.messageHandler(message.data);
    });
  }

  closeHandler(){
    this.services.forEach(service => {
      service.closeHandler();
    });
  }

  openHandler(){
    console.log('WebSocket opened.')
  }

  async init(url:string){
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

  addService(serviceInstance: ISocketService){
    this.services.push(serviceInstance);
    serviceInstance.onSend = (message) => {
      this.send(message);
    }
    serviceInstance.onRemove = () => {
      this.removeService(serviceInstance);
    }
  }

  removeService(serviceInstance: ISocketService){
    serviceInstance.onSend = null;
    this.services = this.services.filter(service => service!==serviceInstance);
  }

  send(message:Object){
    this.socket.send(JSON.stringify(message));
  }
}

(async function test() {
  let socket = new SocketClient();
  await socket.init(socketURL);
  let lobbyService = new LobbyService();
  socket.addService(lobbyService);

  lobbyService.send({
    service:'chat',
    endpoint:'sendToChannel',
    params: {

    }
  });
})();