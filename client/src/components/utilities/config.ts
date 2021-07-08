import { CrossGameChannelModel, CrossGameChannelView } from '../../socketClient/crossGameChannel';
import { OnlyChatChannelModel, OnlyChatChannelView } from '../../socketClient/onlyChatChannel';

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
  ]
]);

export type channelModel = OnlyChatChannelModel | CrossGameChannelModel;
