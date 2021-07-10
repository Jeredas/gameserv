import Vector from './vector';
export interface IPageComponent {
  show: () => void;
  hide: () => void;
}

export interface IAuthData {
  login: string;
  password: string;
}
export interface IUserData {
  login: string;
  password: string;
  avatar: string;
  name: string;
}

export interface IPublicUserInfo {
  login: string;
  avatar: string;
}

export interface IUserAuth {
  login: string;
  avatar: string;
}
export interface IInputState {
  name: boolean;
  pass: boolean;
}

export interface IChannelData {
  channelName: string;
  channelType?: string;
  gameMode: string;
}

export interface IUserChatMessage {
  userName: string;
  avatar: string;
  message: string;
  time: string;
}
export interface IJoinedPlayer {
  player: string;
  players: Array<{ login: string; avatar: string }>;
}
export interface ICrossHistory {
  sign: string;
  move: Vector;
  time: string;
}
export interface ICrossMove {
  player: string;
  field: Array<Array<string>>;
  winner: string;
  history: ICrossHistory;
}

export interface ICrossStop {
  stop: string;
  player: string;
  method: string;
}

export interface IChatUser {
  userName: string;
  avatar: string;
}

export interface IChessStart {
  field: string;
  time: number;
}
export interface IChessStop {
  stop: string;
  player: string;
  method: string;
}

export interface IChessHistory {
  coords: Array<Vector>;
  time: string;
  figName: string;
}

export interface IChessData {
  coords: Array<Vector>;
  player: string;
  field: string;
  winner: string;
  rotate: boolean;
  history: IChessHistory;
  king: Vector;
}
