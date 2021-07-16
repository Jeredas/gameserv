class ChessDrawAgreeResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    stop: string;
    player: string;
    method: string;
  };

  constructor(channelName: string, stop: string, player: string) {
    this.service = 'chat';
    this.type = 'chessStop';
    this.channelName = channelName;
    this.params = { stop, player, method: 'drawAgreeNetwork' };
  }
}

export default ChessDrawAgreeResponse;
