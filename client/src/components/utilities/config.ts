import { ChessGameChannelModel, ChessGameChannelView } from '../../socketClient/chessGameChannel';
import { CrossGameChannelModel, CrossGameChannelView } from '../../socketClient/crossGameChannel';
import { OnlyChatChannelModel, OnlyChatChannelView } from '../../socketClient/onlyChatChannel/onlyChatChannel';
// import crossIcon from '../../assets/cross-icon.png';
// import chessIcon from '../../assets/chess-icon.jpg';
// import chatIcon from '../../assets/chat-icon.png';

import crossIcon from '../../assets/channel-cross.png';
import chessIcon from '../../assets/channel-chess.png';
import chatIcon from '../../assets/channel-chat.png';

export const channelConfig = new Map([
  [
    'OnlyChatChannel',
    {
      model: OnlyChatChannelModel,
      view: OnlyChatChannelView,
      icon: chatIcon
    }
  ],
  [
    'CrossGameChannel',
    {
      model: CrossGameChannelModel,
      view: CrossGameChannelView,
      icon: crossIcon
    }
  ],
  [
    'ChessGameChannel',
    {
      model: ChessGameChannelModel,
      view: ChessGameChannelView,
      icon: chessIcon
    }
  ]
]);

export type channelModel = OnlyChatChannelModel | CrossGameChannelModel | ChessGameChannelModel;

export const chessBotComplexity = new Map([
  [ 'Random', 'random' ],
  [ 'Min-Max', 'min-max' ],
  [ 'Monte-Carlo', 'monte-carlo' ]
]);
