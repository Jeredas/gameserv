export interface ISocketService{
  messageHandler: (message:string)=>void;
  closeHandler: ()=>void;
  openHandler: ()=>void;
  attachClient: (events: {onSend:(message:Object)=>void, onRemove:()=>void})=>void;
  unattachClient: ()=>void;
}
