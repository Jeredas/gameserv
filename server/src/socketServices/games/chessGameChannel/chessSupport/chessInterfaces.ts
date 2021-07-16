import { ChessColor } from "../../../../chess-lib/chess-color";
import Vector from "../../../../utils/vector";

interface IChessHistory {
  coords: Array<Vector>;
  time: number;
  figName: string;
}

export interface IKingInfo {
  coords: Vector;
  rival: Array<Vector>;
}

export interface IPlayerData {
  login: string;
  avatar: string;
  color: ChessColor;
}


export default IChessHistory;
