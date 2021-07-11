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
import { AuthModel } from './components/authModel/authModel';
const socketURL = 'ws://localhost:4080';
import appStyles from './app.module.css';
import RecordPage from './components/recordPage/recordPage';
import GenericPopup from './components/genericPopup/genericPopup';
import ButtonDefault from './components/buttonDefault/buttonDefault';


class ConnectToServer extends GenericPopup<boolean>{
  onClick: () => void
  private openHandler: ()=> void;
  private closeHandler: ()=> void;
  private client: SocketClient;

  constructor(parentNode: HTMLElement, params: {client: SocketClient}) {
    super(parentNode);
    this.client = params.client;
    const button = new ButtonDefault(this.node, '', 'Reconnect');
    this.openHandler = () => this.onSelect(true);
    this.closeHandler = () => button.buttonEnable();

    this.client.onOpen.add(this.openHandler);
    this.client.onClose.add(this.closeHandler);
    button.node.onclick = () => {
      this.client.reconnent();
      button.buttonDisable();
    }
  }
  destroy() {
    this.client.onOpen.remove(this.openHandler);
    this.client.onClose.remove(this.closeHandler);
    super.destroy();
  }

}

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
  private recordPage: RecordPage;
  private lostConnectionPopupOpen: boolean = false;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', appStyles.root);
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
                this.showAuthPopUp().then(res => {
                  if(res) {
                    this.buildChatPage();
                  } else {
                    this.router.activateRouteByName('about');
                  }
                })
              } else {
                this.router.activateRouteByName('about');
                console.log('registration failed');
              }
            });
          } else if(res === 'SignIn') {
            this.showAuthPopUp().then(res => {
              if(res) {
                this.buildChatPage();
              } else {
                this.router.activateRouteByName('about');
              }
            })
          } else if(res === 'Close'){
            this.router.activateRouteByName('about');
          }
        });
      } else {
        console.log('build here')
        this.model.authBySession({sessionId:localStorage.getItem('todoListApplicationSessionId')}).then((res)=>{
          this.currentUser.setData(res)
          this.buildChatPage();
        })
        console.log('Go to chat Page');
      }
    });
    this.navigation = new Navigation(this.node);
    this.currentUser.onUpdate.add(({ from, to }) => {
      this.navigation.setUserData(to)
    })
    this.navigation.onLogout.add(()=>{
      this.removePage('chat');
      this.router.activateRouteByName('about');
      console.log('logged out from header')
      this.chatPage.destroy();
    })
    this.router = new Router();
    this.pageContainer = new Control(this.node, 'div', appStyles.page_container);
    this.about = new AboutPage(this.pageContainer.node);
    this.recordPage = new RecordPage(this.pageContainer.node)

    this.addPage('about', 'about', this.about);
    this.addPage('statistics', 'stat', this.recordPage);
    this.about.onAuth.add((data)=>{
      this.buildChatPage();
      this.currentUser.setData(data)
      this.chatPage.joinUserToChannel(data)
    })
    this.about.onAuthFail.add((res)=>{
      console.log(res);
    })
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
      console.log('popup AUTH',res);
      
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
    lobbyModel.service.onOpen.add(() => {
      this.navigation.addConnection();
    });

    lobbyModel.service.onClose.add(() => {
      this.navigation.removeConnection();
      if(!this.lostConnectionPopupOpen) {
        this.lostConnectionPopupOpen = true;
        popupService.showPopup(ConnectToServer, {client: socket}).then((res) => {
        this.lostConnectionPopupOpen = false;
      })
      }
      
    });
    
    this.chatPage = new ChatPage(this.pageContainer.node, lobbyModel, socket);
    this.addPage('chat', 'chat', this.chatPage);
    this.router.processHash();
  }

  removePage(name: string) {
    this.navigation.removeLink(name);
    this.router.removeRoute(name);
  }
}

export default Application;
