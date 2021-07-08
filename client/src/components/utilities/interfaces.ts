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
  channelType: string;
}

export interface IUserChatMessage {
  userName: string;
  avatar: string;
  message: string;
  time: string;
}
export interface IJoinedPlayer {
  player: string;
  players: Array<string>;
}

export interface ICrossMove {
  coords: Vector;
  player: string;
  field: Array<Array<string>>;
  winner: string;
  sign: string;
}
