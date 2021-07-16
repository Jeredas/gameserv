import Vector from '../../../../utils/vector';

class ChessRecommendedResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    recommended: Array<Vector> | null;
  };

  constructor(channelName: string, recommended: Array<Vector>) {
    this.service = 'chat';
    this.type = 'chessRecommend';
    this.channelName = channelName;
    this.params = {
      recommended
    };
  }
}

export default ChessRecommendedResponse;
