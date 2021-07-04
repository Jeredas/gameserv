import {ChatChannel} from '../socketChannel';

export class OnlyChatChannel extends ChatChannel{
  constructor(name:string){
    super(name);
  }
}