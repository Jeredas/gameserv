class ChessMateResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    method: string;
    player: string;
  };

  constructor(channelName: string, method: string, player = '') {
    this.service = 'chat';
    this.type = 'chessMate';
    this.channelName = channelName;
    this.params = { method, player };
  }
}

export default ChessMateResponse;
