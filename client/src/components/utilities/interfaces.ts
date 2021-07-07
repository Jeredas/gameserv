export interface IPageComponent {
  show: () => void;
  hide: () => void;
}

export interface IAuthData {
  login: string;
  password: string;
}
export interface IUserData {
  login: string,
  password: string,
  avatar: string
  name : string
};

export interface IPublicUserInfo{
  login:string,
  avatar:string
}

export interface IUserAuth {
  login: string;
  avatar: string;
}
export interface IInputState  {
  name : boolean,
  pass:boolean
}