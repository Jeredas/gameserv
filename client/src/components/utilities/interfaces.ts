export interface IHeaderUser {
  wrapper: string;
  user: string;
  avatar: string;
  nickName: string;
  // defaultAvatar: any;
}

export interface IHeaderControls {
  wrapper: string;
  btn: string;
  hidden: string;
}

export interface configHeader {
  wrapper: string;
  logo: {
    logo: string;
    image: any;
  };
  nav: {
    container: string;
  };
  controls: IHeaderControls;
  user: IHeaderUser;
}

export interface IPageComponent {
  show: () => void;
  hide: () => void;
}

export interface IInputWrapper {
  wrapper: string;
  field: string;
  button: string;
}

export interface IMessageBtn {
  btn: string;
}

export interface IChatMessage {
  block: string;
  wrapper: string;
  avatar: string;
  main: string;
  header: string;
  user: string;
  date: string;
  body: string;
}

export interface IuserChatMessage {
  avatar: string;
  userName: string;
  time: string;
  message: string;
}

export interface IChatMessageWrapper {
  wrapper: string;
  message: IChatMessage;
}

export interface IChatUser {
  wrapper: string;
  avatar: string;
  name: string;
}

export interface IChatUserWrapper {
  wrapper: string;
  category: string;
  categoryName: string;
  user: IChatUser;
}

export interface IUsersLang {
  players: string;
  spectators: string;
}

export interface IChannelWrapper {
  wrapper: string;
  constrols: string;
  channels: string;
  channel: string;
  btn: string;
}

export interface IChannelBtn {
  btn: string;
}