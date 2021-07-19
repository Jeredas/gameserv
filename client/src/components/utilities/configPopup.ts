
import chessIcon from '../../assets/select-game-popup/chess.png';
import crossIcon from '../../assets/select-game-popup/cross.png';
import chatIcon from '../../assets/select-game-popup/chat.png';

export const gameSetPopup = [ 'OnlyChatChannel', 'ChessGameChannel', 'CrossGameChannel' ];

export const gameIcons = new Map<string, string>([
  ['ChessGameChannel', chessIcon],
  ['CrossGameChannel', crossIcon],
  ['OnlyChatChannel', chatIcon]
]);

export interface IJoinChannelPopupLangs{
  searchFieldLabel: string,
  searchFieldPlaceHolder: string,
  joinButtonText: string,
  cancelButtonText: string
}

export const joinChannelPopupLangEn:IJoinChannelPopupLangs = {
  searchFieldLabel: 'Enter the name of the channel you want to join',
  searchFieldPlaceHolder: 'Name Channel',
  joinButtonText: 'Join channel',
  cancelButtonText: 'Cancel'
}

export const gameModePopup = [ 'oneScreen', 'network', 'bot' ];
export const channelTypePopup = [ 'OnlyChatChannel', 'ChessGameChannel', 'CrossGameChannel' ];

export const defaultAvatar = '../../assets/select-game-popup/avat-def.png';