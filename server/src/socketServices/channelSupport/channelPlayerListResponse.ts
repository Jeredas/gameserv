import IChatResponse from './channelInterfaces';

class ChannelPlayerListResponse implements IChatResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    playerList: Array<{ login: string; avatar: string }>;
    renew: boolean;
  };

  constructor(channelName: string, playerList: Array<{ login: string; avatar: string }>, renew) {
    this.service = 'chat';
    this.type = 'playerList';
    this.channelName = channelName;
    this.params = {
      playerList: [ ...playerList ],
      renew
    };
  }
}

export default ChannelPlayerListResponse;
