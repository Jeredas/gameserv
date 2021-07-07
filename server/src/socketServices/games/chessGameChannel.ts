import {ChatChannel} from '../socketChannel';

export class ChessGameChannel extends ChatChannel{
  constructor(name:string, type: string, params:any){
    super(name, type);
    console.log('created ChessGameChannel');
    
  }
}