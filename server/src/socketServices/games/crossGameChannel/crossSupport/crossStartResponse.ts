class CrossStartResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    time: number;
  };

  constructor(channelName: string, time: number) {
    this.service = 'chat';
    this.type = 'crossStart';
    this.channelName = channelName;
    this.params = { time };
  }
}

export default CrossStartResponse;
