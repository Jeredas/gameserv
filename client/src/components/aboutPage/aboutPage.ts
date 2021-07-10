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

class AboutPage extends Control {
  wrapper: Control;
  buttonLogIn: ButtonDefault;
  onSelect: (value: any) => void;
  onAuth: Signal<IUserAuth>;
  onAuthFail: Signal<string> = new Signal();
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', aboutStyles.about_wrapper);
    this.node.style.backgroundImage = `url(${aboutImage})`;
    const aboutFade = new Control(this.node, 'div', aboutStyles.about_fade);
    const inner = new Control(aboutFade.node, 'div', aboutStyles.about_inner);
    const textBlock = new Control(inner.node, 'div', aboutStyles.about_welcome);
    aboutWelcome.forEach((text) => {
      const textItem = new Control(textBlock.node, 'div', aboutStyles.about_welcome);
      textItem.node.textContent = text;
    });
    this.onAuth = new Signal();

    this.buttonLogIn = new ButtonDefault(inner.node, aboutStyles.about_button, 'Log In');

    this.buttonLogIn.onClick = () => {
      this.hide();
      popupService.init(parentNode);
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
              this.show();
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
          this.show();
          //this.onAuthFail.emit('fail')
        }
      });
    };
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
        console.log(res.data, 'res data');
        return { status: true, data: res.data };
      } else {
        this.show();
        return { status: false };
      }
    });
  }
}

export default AboutPage;
