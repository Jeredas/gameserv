import { ICrossHistory } from "../crossGameChannel";

class CrossMoveResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    player: string;
    field: Array<Array<string>>;
    winner: string;
    history: ICrossHistory;
  };

  constructor(
    channelName: string,
    player: string,
    field: Array<Array<string>>,
    winner: string,
    history: ICrossHistory
  ) {
    this.service = 'chat';
    this.type = 'crossMove';
    this.channelName = channelName;
    this.params = {
      player,
      field,
      winner,
      history
    };
  }
}

export default CrossMoveResponse;
