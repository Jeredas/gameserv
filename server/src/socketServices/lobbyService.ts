import { ChatChannel } from './socketChannel';
import { OnlyChatChannel } from './games/onlyChatChannel';
import { connection } from 'websocket';
import { CrossGameChannel } from './games/crossGameChannel/crossGameChannel';
import { ChessGameChannel } from './games/chessGameChannel/chessGameChannel';

function createChannel(type: string, channelName, params: any): ChatChannel {
  return new { OnlyChatChannel, CrossGameChannel, ChessGameChannel }[type](
    channelName,
    type,
    params
  );
}

export class LobbyService {
  readonly serviceName = 'lobby';
  private channels: Array<ChatChannel>;
  clients: connection[];

  constructor() {
    this.channels = [];
    this.clients = [];
  }

  sendToChannel(userConnection: connection, params: any) {
    const foundChannel = this.channels.find((channel) => channel.name == params.channelName);

    if (foundChannel) {
      foundChannel[params.channelMethod](userConnection, params.channelRequestParams);
      // console.log('foundChannel', foundChannel);
    } else {
      userConnection.sendUTF(
        JSON.stringify({
          service: 'chat',
          type: 'sendStatus',
          params: {
            requestId: params.requestId,
            status: 'error',
            description: 'channel not found'
          }
        })
      );
    }
  }

  createNewChannel(userConnection: connection, params: any) {
    const foundChannel = this.channels.find((channel) => channel.name == params.channelName);
    if (!foundChannel) {
      const newChannel = createChannel(
        params.channelType,
        params.channelName,
        params.channelParams
      );
      this.channels.push(newChannel);
      userConnection.sendUTF(
        JSON.stringify({
          service: 'chat',
          type: 'created',
          params: {
            requestId: params.requestId,
            status: 'ok',
            channelType: params.channelType
          }
        })
      );
      this._sendToAll({
        service: 'chat',
        type: 'channelList',
        params: {
          channelList: this.channels.map((channels) => {
            return {
              name: channels.name,
              type: channels.type
            };
          })
        }
      });
    } else {
      userConnection.sendUTF(
        JSON.stringify({
          service: 'chat',
          type: 'created',
          params: {
            requestId: params.requestId,
            status: 'existed'
          }
        })
      );
    }
  }

  closeConnection(connection) {
    this._leaveUser(connection);
    this.channels.forEach((channel) => {
      channel.leaveUser(connection, {});
    });
  }
  channelList(userConnection: connection) {
    userConnection.sendUTF(
      JSON.stringify({
        service: 'chat',
        type: 'channelList',
        params: {
          channelList: this.channels.map((channels) => {
            return {
              name: channels.name,
              type: channels.type
            };
          })
        }
      })
    );
  }
  getChannelInfo(userConnection: connection, params: any) {
    const foundChannel = this.channels.find((channel) => channel.name == params.channelName);
    if (foundChannel) {
      // foundChannel[params.channelMethod](userConnection, params.channelRequestParams);
      userConnection.sendUTF(
        JSON.stringify({
          service: 'chat',
          type: 'channelType',
          params: {
            requestId: params.requestId,
            status: 'ok',
            channelType: foundChannel.type,
            channelName: foundChannel.name,
            gameMode: foundChannel.gameMode
          }
        })
      );

      // console.log('foundChannel', foundChannel);
    } else {
      userConnection.sendUTF(
        JSON.stringify({
          service: 'chat',
          type: 'channelType',
          params: {
            requestId: params.requestId,
            status: 'error',
            description: 'channel not found'
          }
        })
      );
    }
  }
  _joinUser(userConnection: connection) {
    if (
      this.clients.find((client) => {
        client == userConnection;
      })
    ) {
    } else {
      this.clients.push(userConnection);
    }
  }
  _leaveUser(userConnection: connection) {
    this.clients = this.clients.filter((client) => client !== userConnection);
  }
  acceptConnection(userConnection: connection) {
    this._joinUser(userConnection);
  }
  _sendToAll(message: Object) {
    this.clients.forEach((client) => {
      client.sendUTF(JSON.stringify(message));
    });
  }
}
