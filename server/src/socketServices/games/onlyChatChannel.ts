import {ChatChannel} from '../socketChannel';

export class OnlyChatChannel extends ChatChannel{
  constructor(name:string, type: string, params:any){
    super(name, type, params);
    console.log('created OnlyChatChannel');
    
  }
}