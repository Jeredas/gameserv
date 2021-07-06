import Control from '../components/control';
import {ISocketService} from './ISocketService';
import { SocketClient } from './socketClient';
import Signal from './signal';


export class LobbyService implements ISocketService{
  private onSend:(message:Object)=>void = null;
  private onRemove:()=>void = null;

  public onJoined: Signal<any> = new Signal<any>();
  public onCreated: Signal<any> = new Signal<any>();
  public onClose: Signal<any> = new Signal<any>();
  public onOpen: Signal<any> = new Signal<any>();

  constructor(){

  }

  messageHandler(rawMessage:string){
    const message = JSON.parse(rawMessage);
    if (message.service === 'chat'){
      const processFunction = new Map<string, ((params:any)=>void)>(
        [
          ['joined', (params)=>{
            this.onJoined.emit(params);
          }],
          ['created', (params)=>{
            this.onCreated.emit(params);
          }]
        ]
      ).get(message.type)
      
      if (processFunction){
        processFunction(message.params);
      }
    }
  }

  closeHandler(){
    console.log('close');
    this.onClose.emit({});
  }

  openHandler(){
    console.log('open');
    this.onOpen.emit({});
  }

  attachClient(events: {onSend:(message:Object)=>void, onRemove:()=>void}){
    this.onSend = events.onSend;
    this.onRemove = events.onRemove;
  }

  unattachClient(){
    this.onSend = null;
    this.onRemove = null;
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

export class LobbyModel{
  service: LobbyService;
  serviceName:string = 'chat';
  //socketClient:SocketClient;

  constructor(socketClient:SocketClient){
    //this.socketClient = socketClient;
    this.service = new LobbyService();
    socketClient.addService(this.service);
    /*this.service.onCreated.add(params=>{
      console.log(params);
    })*/
  }

  /*joinChannel(channelName:string){
    return new Promise((resolve, reject) => {
      const requestId = Date.now() + Math.floor(Math.random() * 10000);
      const listener = (params: any) => {
        if (params.requestId == requestId) {
          this.service.onJoined.remove(listener);
          resolve(params);
        }
      }
      this.service.onJoined.add(listener);
      this.service.send({
        sessionId: '',
        service: this.serviceName,
        endpoint: 'sendToChannel',
        params: {
          channelName: channelName,
          channelMethod: 'joinUser',
          channelRequestParams: {
            requestId: requestId
          }
        }
      });
    });
  }*/

  createNewChannel(channelName:string){
    return new Promise((resolve, reject)=>{
      const requestId = Date.now()+Math.floor(Math.random()*10000);
      const listener = (params:any) => {
        if (params.requestId == requestId){
          this.service.onCreated.remove(listener);
          resolve(params);
        }
      }
      this.service.onCreated.add(listener);
      this.service.send({
        
        sessionId: '',
        service: this.serviceName,
        endpoint: 'createNewChannel',
        params: {
          requestId: requestId,
          channelName: channelName,
          channelType: 'OnlyChatChannel'
        }
      });
    });
  }

  destroy(){
    this.service.remove();
  }
}

export class LobbyView extends Control{
  model: LobbyModel;
  onJoinClick: ()=>void;

  constructor(parentNode:HTMLElement, model:LobbyModel){
    super(parentNode);
    this.model = model;

    const connectionIndicator = new Control(this.node);
    const joinChannelButton = new Control(this.node, 'div', '', 'join');
    const createChannelButton = new Control(this.node, 'div', '', 'create');

    joinChannelButton.node.onclick = ()=>{
     /* this.model.joinChannel('dgh').then(res=>{
        console.log(res);
      });*/
      this.onJoinClick?.();
    }

    createChannelButton.node.onclick = ()=>{
      this.model.createNewChannel('dgh').then(res=>{
        console.log(res);
      });
    }

    model.service.onClose.add(()=>{
      connectionIndicator.node.textContent = 'disconnected';
      //connectionIndicator.node.onclick = ()=>{
      //  model.socketClient.reconnent();
      //}
    });

    model.service.onOpen.add(()=>{
      connectionIndicator.node.textContent = 'connected';
      //connectionIndicator.node.onclick = ()=>{
      //  model.socketClient.reconnent();
      //}
    })
  }
}

//new LobbyView(document.body, new LobbyModel(new SocketClient()));