import { ChessGameChannelModel, ChessGameChannelView } from '../../socketClient/chessGameChannel';
import { CrossGameChannelModel, CrossGameChannelView } from '../../socketClient/crossGameChannel';
import {
  OnlyChatChannelModel,
  OnlyChatChannelView
} from '../../socketClient/onlyChatChannel/onlyChatChannel';
import crossIcon from '../../assets/cross-icon.png';
import chessIcon from '../../assets/chess-icon.jpg';
import chatIcon from '../../assets/chat-icon.png';

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
  [ 'Easy', 'random' ],
  [ 'Medium', 'monte-carlo' ],
  [ 'Hard', 'min-max' ]
]);
