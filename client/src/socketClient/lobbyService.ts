import {ISocketService} from './ISocketService';

export class LobbyService implements ISocketService{
  public onSend:(message:Object)=>void = null;
  public onRemove:()=>void = null;

  constructor(){

  }

  messageHandler(message:string){
    console.log(message);
  }

  closeHandler(){
    console.log('close')
  }

  send(message:Object){
    if (this.onSend){
      this.onSend(message);
    } else {
      throw new Error ('Add service to SocketClient for use send function.')
    }
  }

  remove(){
    if (this.onRemove){
      this.onRemove();
    } else {
      throw new Error ('Add service to SocketClient for use remove function.')
    }
  }
}