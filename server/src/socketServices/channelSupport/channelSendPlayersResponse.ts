import IChatResponse from "./channelInterfaces";

class ChannelSendPlayersResponse implements IChatResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    player: string;
    players: Array<{ login: string; avatar: string }>;
  };

  constructor(
    channelName: string,
    player: string,
    players: Array<{ login: string; avatar: string }>
  ) {
    this.service = 'chat';
    this.type = 'getPlayers';
    this.channelName = channelName;
    this.params = { player, players };
  }
}

export default ChannelSendPlayersResponse;