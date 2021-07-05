import Control from '../components/control';
import {ISocketService} from './ISocketService';
import { SocketClient } from './socketClient';
import Signal from './signal';


export class OnlyChatChannelService implements ISocketService{
  private onSend:(message:Object)=>void = null;
  private onRemove:()=>void = null;

  public onMessage: Signal<any> = new Signal<any>();
  public onClose: Signal<any> = new Signal<any>();
  public onOpen: Signal<any> = new Signal<any>();

  constructor(){

  }

  messageHandler(rawMessage:string){
    console.log(rawMessage);
    const message = JSON.parse(rawMessage);
    if (message.service === 'chat'){
      const processFunction = new Map<string, ((params:any)=>void)>(
        [
          ['message', (params)=>{
            this.onMessage.emit(params);
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


export class OnlyChatChannelModel{
  service: OnlyChatChannelService;
  serviceName:string = 'chat';
  channelName:string;
  //socketClient:SocketClient;

  constructor(socketClient:SocketClient, channelName:string){
    //this.socketClient = socketClient;
    this.channelName = channelName;
    this.service = new OnlyChatChannelService();
    socketClient.addService(this.service);
    /*this.service.onCreated.add(params=>{
      console.log(params);
    })*/
  }

  sendMessage(message:string){
    this.service.send({
      sessionId: '',
      service: this.serviceName,
      endpoint: 'sendToChannel',
      params: {
        channelName: this.channelName, 
        channelMethod: 'sendMessage',
        channelRequestParams: {
          messageText: message
        }
      }
    });
  }

  destroy(){
    this.service.remove();
  }
}

export class OnlyChatChannelView extends Control{
  model: OnlyChatChannelModel;

  constructor(parentNode:HTMLElement, model:OnlyChatChannelModel){
    super(parentNode);
    this.model = model;

    const connectionIndicator = new Control(this.node);
    const sendMessageButton = new Control(this.node, 'div', '', 'send');

    const messagesContainer = new Control(this.node);

    this.model.service.onMessage.add((params)=>{
      const message = new Control(this.node, 'div', '', JSON.stringify(params));
    })
    sendMessageButton.node.onclick = ()=>{
      this.model.sendMessage('fsgds');
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

