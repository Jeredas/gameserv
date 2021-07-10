import { UserDataState } from './components/userData.ts/userData';
import { popupService } from './components/popupService/popupService';
import Control from './components/utilities/control';
import CheckSession from './components/temporary/checkSession';
import { Navigation } from './components/header/navigation';
import AboutPage from './components/aboutPage/aboutPage';
import ChatPage from './components/chatPage/chatPage';
import { IPageComponent, IUserAuth } from './components/utilities/interfaces';
import { Router } from './components/router/router';
import { Route } from './components/router/route';
import { RegForm } from './components/regForm/regForm';
import { AuthForm } from './components/authForm/authForm';
import RegisterCheck from './components/registerCheck/registerCheck';
import { SocketClient } from './socketClient/socketClient';
import { LobbyModel } from './socketClient/lobbyService';
import { throws } from 'assert/strict';
import { AuthModel } from './components/authModel/authModel';
const socketURL = 'ws://localhost:4080';
class Application extends Control {
  navigation: Navigation;

  router: Router;

  about: AboutPage;

  chatPage: ChatPage;

  pageContainer: Control;

  currentUser: UserDataState;
  model : AuthModel;
  onAuth: (param: IUserAuth) => void = () => { };
  onAuthFail: (param: string) => void = () => { };

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'app');
    this.model = new AuthModel()
    this.currentUser = new UserDataState(null);
    popupService.init(parentNode);
    popupService.showPopup(CheckSession).then((res) => {
      if (!res) {
        popupService.showPopup(RegisterCheck).then((res) => {
          if (res==='SignUp') {
            popupService.showPopup(RegForm).then((res) => {
              if (res === 'register') {
                console.log('registered');
                this.showAuthPopUp()
                this.buildChatPage();
              } else {
                this.about.show();
                console.log('registration failed');
              }
            });
          } else if(res === 'SignIn') {
            this.buildChatPage();
            this.showAuthPopUp()
          } else if(res === 'Close'){
            this.about.show();
          }
        });
      } else {
        console.log('build here')
        this.navigation.clearNavs();
        this.buildChatPage();
        this.model.authBySession({sessionId:localStorage.getItem('todoListApplicationSessionId')}).then((res)=>{
          this.currentUser.setData(res)
        })
        console.log('Go to chat Page');
      }
    });

    // popupService.showPopup(SettingsUser)
    // popupService.showPopup(RegForm);
    this.navigation = new Navigation(this.node);
    this.currentUser.onUpdate.add(({ from, to }) => {
      this.navigation.setUserData(to)
    })
    this.navigation.onLogout.add(()=>{
      this.navigation.clearNavs();
      this.addPage('about', 'about', this.about);
      this.about.show();
      console.log('logged out from header')
      this.chatPage.destroy();
    })
    this.router = new Router();
    this.pageContainer = new Control(this.node, 'div', '');
    this.about = new AboutPage(this.pageContainer.node);
    this.about.hide();
    this.about.onAuth.add((data)=>{
      this.navigation.clearNavs();
      this.buildChatPage();
      this.currentUser.setData(data)
      this.chatPage.joinUserToChannel(data)
    })
    this.about.onAuthFail.add((res)=>{
      console.log(res);
      this.navigation.clearNavs();
      this.buildChatPage();
      this.chatPage.destroy();
    })
    // const socket = new SocketClient();
    // let lobbyModel = new LobbyModel(socket);
    // socket.init(socketURL);

    // this.chatPage = new ChatPage(this.pageContainer.node, lobbyModel, socket);
    // this.addPage('about', 'about', this.about);
    // this.addPage('chat', 'chat', this.chatPage);
    // this.router.processHash();

  }

  addPage(linkName: string, pageName: string, pageComponent: IPageComponent) {
    const route = new Route(
      pageName,
      linkName,
      () => {
        pageComponent.show();
        this.navigation.setActive(pageName);
      },
      () => {
        pageComponent.hide();
      }
    );
    this.navigation.addLink(linkName, pageName);
    this.router.addRoute(route);
  }

  private showAuthPopUp() {
    return popupService.showPopup<{ status: string, data: IUserAuth }>(AuthForm).then((res) => {
      if (res.status === 'login') {
        this.currentUser.setData(res.data)
        return true;
      } else {
        this.about.show();
        return false;
      }
    })
  }
  buildChatPage(){
    const socket = new SocketClient();
    let lobbyModel = new LobbyModel(socket);
    socket.init(socketURL);
    this.chatPage = new ChatPage(this.pageContainer.node, lobbyModel, socket);
    this.addPage('about', 'about', this.about);
    this.addPage('chat', 'chat', this.chatPage);
    this.router.processHash();
  }
}

export default Application;
