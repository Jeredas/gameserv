import IChessHistory, { IKingInfo } from "./chessInterfaces";

class ChessMoveResponse {
  public type: string;
  public service: string;
  public channelName: string;

  public params: {
    player: string;
    field: string;
    coords: string;
    history: IChessHistory;
    king: {
      check: IKingInfo | null;
      mate: boolean;
      staleMate: boolean;
    };
  };

  constructor(
    channelName: string,
    player: string,
    field: string,
    coords: string,
    history: IChessHistory | null,
    king: {
      check: IKingInfo | null;
      mate: boolean;
      staleMate: boolean;
    }
  ) {
    this.service = 'chat';
    this.type = 'chessMove';
    this.channelName = channelName;
    this.params = {
      player,
      field,
      coords,
      history,
      king
    };
  }
}

export default ChessMoveResponse;
