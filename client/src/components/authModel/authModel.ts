
import Signal from '../../socketClient/signal';
import { httpUrl } from '../utilities/apiConfig';
import { IAuthData, IPublicUserInfo, IUserAuth, IUserData } from '../utilities/interfaces';
import appStorage from '../utilities/storage';
import { apiPostRequest, apiRequest } from '../utilities/utils';


const apiUrl = `${httpUrl}/authService/`;

export class AuthModel {
  onResult: Signal<string> = new Signal();
  public onLogIn: Signal<IUserAuth> = new Signal();

  constructor() {

  }

  async sendAuthData(userData: IAuthData) {
    const response = await apiRequest(apiUrl, 'auth', userData).then((res) => {
      // console.log(res.data,'auth response');
        const loginData = {
          login: res.data.userData.login,
          avatar: res.data.userData.avatar,
          //name: res.data.userData.name
        }
        appStorage.removeSession();
        appStorage.setSession(res.data.session);
        this.onLogIn.emit(loginData);
        return true
    }).catch((err)=>{
      return false
    });
    return response
  }

  async testAccess() {
    const response = await apiRequest(apiUrl, 'testAccess', {}).then((res) => {
      // console.log(res.userData);
      if(res.userData){
        console.log('session exists');
        return true;
      } else {
        console.log('session don`t exists');
        return false;
      }
    });
    return response
  }

  async registerUser(userData: IUserData) {
    const request = await apiPostRequest(apiUrl, 'register', userData).then(res => {
      return res
    });
    return request

  }

  regValidation(userData: IAuthData): Promise<string> {
    const status = apiRequest(apiUrl, 'regValidation', userData).then((res) => res.status);
    return status;
  }

  authValidation(userData: IAuthData): Promise<string> {
    const status = apiRequest(apiUrl, 'authValidation', userData).then((res) => res.status);
    return status;
  }

  passwordValidation(userData: IAuthData): Promise<string> {
    const status = apiRequest(apiUrl, 'passwordValidation', userData).then((res) => res.status);
    return status;
  }
  validateUser(userData: IAuthData): Promise<string> {
    const status = apiRequest(apiUrl, 'checkUser', userData).then((res) => {
      return res.status;
    })
    return status
  }
  getPublicUserInfo(userData: IAuthData): Promise<IPublicUserInfo> {
    const userInfo = apiRequest(apiUrl, 'getPublicUserInfo', userData).then((res) => {
      return {
        login: res.login,
        avatar: res.avatar
      };
    })
    return userInfo
  }
  authBySession(params:{sessionId:string}){
    const userInfo = apiRequest(apiUrl, 'authBySession', params).then((res) => {
      console.log(res)
      return {
        login: res.data.userData.login,
        avatar: res.data.userData.avatar
      };
    })
    return userInfo
  }


}
