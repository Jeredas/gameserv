class CrossDrawResponse {
  public type: string;
  public service: string;
  public channelName: string;
  time: number;
  public params: {
    stop: string;
    player: string;
    method: string;
  };

  constructor(channelName: string, stop: string, player: string) {
    this.service = 'chat';
    this.type = 'crossStop';
    this.channelName = channelName;
    this.params = { stop, player, method: 'drawNetwork' };
  }
}

export default CrossDrawResponse;
