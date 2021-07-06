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
  public onAny: Signal<any> = new Signal<any>();

  constructor(){

  }

  messageHandler(rawMessage:string){
    console.log(rawMessage);
    const message = JSON.parse(rawMessage);
    if (message.service === 'chat'){
      this.onAny.emit(message);
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

  private send(method:string, params:Object){
    this.service.send({
      sessionId: '',
      service: this.serviceName,
      endpoint: 'sendToChannel',
      params: {
        channelName: this.channelName,
        channelMethod: method,
        channelRequestParams: params
      }
    });
  }

  private sendAwaiting(method:string, request:object):Promise<any>{
    return new Promise((resolve, reject)=>{
      const requestId = Date.now()+Math.floor(Math.random()*10000);
      const listener = (params:any) => {
        if (params.requestId == requestId){
          this.service.onAny.remove(listener);
          resolve(params);
        }
      }
      this.service.onAny.add(listener);
      this.send(method, {...request, requestId: requestId})
    });
  }

  sendMessage(message:string){
    this.send('sendMessage', {
      messageText: message
    }); 
  }

  leaveChannel(){
    this.send('leaveUser', {});
  }

  async joinChannel(){
    const joinResponse = await this.sendAwaiting('joinUser', {});
    return joinResponse.params.status == 'ok';
  }

  destroy(){
    this.service.remove();
  }
}

export class OnlyChatChannelView extends Control{
  model: OnlyChatChannelModel;
  onLeaveClick: ()=>void;

  constructor(parentNode:HTMLElement, model:OnlyChatChannelModel){
    super(parentNode);
    this.model = model;

    const connectionIndicator = new Control(this.node);
    const sendMessageButton = new Control(this.node, 'div', '', 'send');
    const leaveMessageButton = new Control(this.node, 'div', '', 'leave');

    const messagesContainer = new Control(this.node);

    this.model.service.onMessage.add((params)=>{
      const message = new Control(this.node, 'div', '', JSON.stringify(params));
    })
    sendMessageButton.node.onclick = ()=>{
      this.model.sendMessage('fsgds');
    }

    leaveMessageButton.node.onclick = ()=>{
      this.model.leaveChannel();
      this.onLeaveClick?.();
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

  destroy(){
    this.node.remove();
  }
}

