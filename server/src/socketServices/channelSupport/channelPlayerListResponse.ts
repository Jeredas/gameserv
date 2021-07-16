import IChatResponse from './channelInterfaces';

class ChannelPlayerListResponse implements IChatResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    playerList: Array<{ login: string; avatar: string }>;
  };

  constructor(channelName: string, playerList: Array<{ login: string; avatar: string }>) {
    this.service = 'chat';
    this.type = 'playerList';
    this.channelName = channelName;
    this.params = {
      playerList: [ ...playerList ]
    };
  }
}

export default ChannelPlayerListResponse;
