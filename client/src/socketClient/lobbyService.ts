import { State } from './../components/state/state';
import Control from '../components/utilities//control';
import {ISocketService} from './ISocketService';
import { SocketClient } from './socketClient';
import Signal from './signal';
import { IChannelData } from '../components/utilities/interfaces';
import appStorage from '../components/utilities/storage';
import { chessBotComplexity } from '../components/utilities/config';


export class LobbyService implements ISocketService{
  private onSend:(message:Object)=>void = null;
  private onRemove:()=>void = null;

  public onJoined: Signal<any> = new Signal<any>();
  public onCreated: Signal<any> = new Signal<any>();
  public onClose: Signal<any> = new Signal<any>();
  public onOpen: Signal<any> = new Signal<any>();
  public onChannelType: Signal<any> = new Signal<any>();
  public onChannelList: Signal<any> = new Signal<any>();

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
          }],
          ['channelType', (params) => {
            this.onChannelType.emit(params);
          }],
          ['channelList', (params) => {
            this.onChannelList.emit(params.channelList);
          }]
        ]
      ).get(message.type)
      
      if (processFunction){
        processFunction(message.params);
      }
    }
  }

  closeHandler(){
    this.onClose.emit({});
  }

  openHandler(){
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
  channels: State<Array<any>>

  //socketClient:SocketClient;

  constructor(socketClient:SocketClient){
    this.channels = new State([]);
    this.service = new LobbyService();
    socketClient.addService(this.service);
    this.service.onChannelList.add((param)=>{
      this.channels.setData(param)
    })
    if(socketClient.socket){
      this.channelList();
    }
    this.service.onOpen.add((data)=>{
      this.channelList();
    })
  }

  getChannelInfo(channelName:string){
    return new Promise((resolve, reject) => {
      const requestId = Date.now() + Math.floor(Math.random() * 10000);
      const listener = (params: any) => {
        if (params.requestId == requestId) {
          this.service.onChannelType.remove(listener);
          resolve(params);
        }
      }
      this.service.onChannelType.add(listener);
      this.service.send({
        sessionId: appStorage.getSession(),
        service: this.serviceName,
        endpoint: 'getChannelInfo',
        params: {
          requestId: requestId,
          channelName: channelName,
        }
      });
    })
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

  createNewChannel(newChannel: IChannelData){
    return new Promise((resolve, reject)=>{
      const requestId = Date.now()+Math.floor(Math.random()*10000);
      const listener = (params:any) => {
        if (params.requestId == requestId){
          this.service.onCreated.remove(listener);
          resolve(params);
        }
      }
      this.service.onCreated.add(listener);
      console.log('model channel', newChannel.complexity);
      
      this.service.send({
        
        sessionId: appStorage.getSession(),
        service: this.serviceName,
        endpoint: 'createNewChannel',
        params: {
          requestId: requestId,
          channelName: newChannel.channelName,
          channelType: newChannel.channelType,
          channelParams: {
            gameMode: newChannel.gameMode,
            complexity: chessBotComplexity.get(newChannel.complexity)
          }
        }
      });
    });
  }
  channelList(): void {
    this.service.send(
      {
        service: this.serviceName ,
        endpoint: 'channelList',
        params: {
          sessionId: appStorage.getSession(),
        },
      },
    );
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
      this.onJoinClick?.();
    }

    createChannelButton.node.onclick = ()=>{
      this.model.createNewChannel({channelName:'dgh', channelType:'OnlyChatChannel', gameMode: 'network'}).then(res=>{
        console.log(res);
      });
    }

    model.service.onClose.add(()=>{
      connectionIndicator.node.textContent = 'disconnected';
    });

    model.service.onOpen.add(()=>{
      connectionIndicator.node.textContent = 'connected';
    })
  }
}

//new LobbyView(document.body, new LobbyModel(new SocketClient()));