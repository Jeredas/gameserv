export interface ISocketService{
  messageHandler: (message:string)=>void;
  closeHandler: ()=>void;
  onSend: (message:Object)=>void;
  onRemove: ()=>void;
}
