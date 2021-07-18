class CrossRenewResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    method: string;
  };

  constructor(channelName: string) {
    this.service = 'chat';
    this.type = 'chessRenew';
    this.channelName = channelName;
    this.params = { method: 'renew' };
  }
}

export default CrossRenewResponse;
