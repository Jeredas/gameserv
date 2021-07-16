class ChessStartResponse {
  public type: string;
  public service: string;
  public channelName: string;
  public params: {
    time: number;
    field: string;
  };

  constructor(channelName: string, startTime: number, startField: string) {
    this.service = 'chat';
    this.type = 'chessStart';
    this.channelName = channelName;
    this.params = {
      time: startTime,
      field: startField
    };
  }
}

export default ChessStartResponse;
