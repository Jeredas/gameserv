class CrossNoMovesResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    method: string;
    player: string;
  };

  constructor(channelName: string) {
    this.service = 'chat';
    this.type = 'crossNoMoves';
    this.channelName = channelName;
    this.params = { method: 'noMoves', player: '' };
  }
}

export default CrossNoMovesResponse;
