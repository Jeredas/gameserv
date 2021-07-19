import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';
import stylePopup from '../popupService/popupService.module.css';
import headerStyles from '../header/header.module.css';
import { popupService } from '../popupService/popupService';
import RegisterCheck from '../registerCheck/registerCheck';
import { AuthForm } from '../authForm/authForm';
import { RegForm } from '../regForm/regForm';
import Signal from '../../socketClient/signal';
import { IUserAuth } from '../utilities/interfaces';
import aboutImage from '../../assets/bg-about.jpg';
import aboutWelcome from './config_about';
import aboutStyles from './about.module.css';


class UnregisteredUser extends Control {
  buttonLogIn: ButtonDefault;
  
  public onLoginClick: () => void;
  public onHeaderClick: () => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', aboutStyles.about_welcome);
    aboutWelcome.forEach((text) => {
      const textItem = new Control(this.node, 'div', aboutStyles.about_welcome);
      textItem.node.textContent = text;
    });

    this.buttonLogIn = new ButtonDefault(this.node, aboutStyles.about_button, 'Log In');
    this.buttonLogIn.onClick = () => {
      this.onLoginClick?.()
    };
  }
}

class RegisteredUser extends Control {
  constructor(parentNode: HTMLElement, userData: IUserAuth) {
    super(parentNode, 'div', aboutStyles.about_welcome);
    aboutWelcome.forEach((text) => {
      const textItem = new Control(this.node, 'div', aboutStyles.about_welcome);
      textItem.node.textContent = text;
    });
  }
}

class AboutPage extends Control {
  // buttonLogIn: ButtonDefault;
  // onSelect: (value: any) => void;
  onAuth: Signal<IUserAuth> = new Signal();
  onAuthFail: Signal<string> = new Signal();

  private aboutFade: Control;
  private aboutView: Control = null;
  unregistered: UnregisteredUser;
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', aboutStyles.about_wrapper);
    this.node.style.backgroundImage = `url(${aboutImage})`;
    this.aboutFade = new Control(this.node, 'div', aboutStyles.about_fade);
    this.unregistered = new UnregisteredUser(this.aboutFade.node);
    this.unregistered.onHeaderClick = () => {
      this.logInHeader();
    }
  }

  logInHeader() {
    popupService.showPopup(RegisterCheck).then((res) => {
      if (res === 'SignUp') {
        popupService.showPopup(RegForm).then((res) => {
          if (res === 'register') {
            console.log('registered');
            this.showAuthPopUp().then((res) => {
              if (res.status === true) {
                this.onAuth.emit(res.data);
              } else {
                this.onAuthFail.emit('fail');
              }
            });
          } else {
            this.onAuthFail.emit('fail');
            console.log('registration failed');
          }
        });
      } else if (res === 'SignIn') {
        this.showAuthPopUp().then((res) => {
          if (res.status === true) {
            this.onAuth.emit(res.data);
          } else {
            this.onAuthFail.emit('fail');
          }
        });
      } else if (res === 'Close') {
        //this.onAuthFail.emit('fail')
      }
    });
  }

  hide(): void {
    this.node.classList.add(headerStyles.default_hidden);
  }

  show(): void {
    this.node.classList.remove(headerStyles.default_hidden);
  }
  private showAuthPopUp() {
    return popupService.showPopup<{ status: string; data: IUserAuth }>(AuthForm).then((res) => {
      if (res.status === 'login') {
        return { status: true, data: res.data };
      } else {
        return { status: false };
      }
    });
  }

  setUserData(userData: IUserAuth) {
    if(this.aboutView) this.aboutView.destroy()
    if(userData != null) {
      this.aboutView = new RegisteredUser(this.aboutFade.node, userData)
    } else {
      //const unregistered = new UnregisteredUser(this.aboutFade.node);
      this.aboutView = this.unregistered;
      this.unregistered.onLoginClick = () => {this.logInHeader()}
    }
  }

}

export default AboutPage;
