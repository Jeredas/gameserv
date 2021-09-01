import { ChessColor } from '../../../../chess-lib/chess-color';
import { IPlayerData } from './chessInterfaces';

class ChessPlayer implements IPlayerData {
  login: string;
  avatar: string;
  color: ChessColor;
  
  constructor(login: string, avatar: string, color: ChessColor) {
    this.login = login ;
    this.avatar = avatar;
    this.color = color;
  }
}

export default ChessPlayer;
