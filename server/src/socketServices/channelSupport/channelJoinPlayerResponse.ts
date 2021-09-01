class ChannelJoinPlayerResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public requestId: number;
  public params: {
    status: string;
  };

  constructor(channelName: string, status: string, requestId: number) {
    this.service = 'chat';
    this.type = 'joined';
    this.channelName = channelName;
    this.requestId = requestId;
    this.params = { status };
  }
}

export default ChannelJoinPlayerResponse;
