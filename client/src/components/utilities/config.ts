import { ChessGameChannelModel, ChessGameChannelView } from '../../socketClient/chessGameChannel';
import { CrossGameChannelModel, CrossGameChannelView } from '../../socketClient/crossGameChannel';
import { OnlyChatChannelModel, OnlyChatChannelView } from '../../socketClient/onlyChatChannel/onlyChatChannel';

export const channelConfig = new Map([
  [
    'OnlyChatChannel',
    {
      model: OnlyChatChannelModel,
      view: OnlyChatChannelView
    }
  ],
  [
    'CrossGameChannel',
    {
      model: CrossGameChannelModel,
      view: CrossGameChannelView
    }
  ],
  [
    'ChessGameChannel',
    {
      model: ChessGameChannelModel,
      view: ChessGameChannelView
    }
  ]
]);

export type channelModel = OnlyChatChannelModel | CrossGameChannelModel | ChessGameChannelModel;
