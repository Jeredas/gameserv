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