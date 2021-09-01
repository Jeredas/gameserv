import Vector from '../../../../utils/vector';

class ChessGrabResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    allowed: Array<Vector>;
  };

  constructor(channelName: string, allowed: Array<Vector>) {
    this.service = 'chat';
    this.type = 'chessGrab';
    this.channelName = channelName;
    this.params = {
      allowed
    };
  }
}

export default ChessGrabResponse;
