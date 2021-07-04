import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';
import stylePopup from '../popupService/popupService.css';
import headerStyles from '../header/header.css';
import { popupService } from '../popupService/popupService';
import RegisterCheck from '../registerCheck/registerCheck';
import { AuthForm } from '../AuthForm/authForm';
import { RegForm } from '../regForm/regForm';

class AboutPage extends Control {
  wrapper:Control;
  buttonLogIn: ButtonDefault;
  constructor(parentNode:HTMLElement) {
    super(parentNode, 'div', 'about_page');

    this.wrapper = new Control(this.node);
    this.wrapper.node.innerHTML = `
    <div>Welcome dear Guest!</div>
    <div>You are about to start an adventure with a humble set of games on our site.</div>
    <div>What you need is only to press the big button below to sign in and enter the game page to chat with friends, participate in a game of your choice or just enjoy with other players' matches.</div>
    `;
    this.buttonLogIn = new ButtonDefault(this.node, stylePopup.popup_default_button, 'log in');

    this.buttonLogIn.onClick = () => {
      popupService.showPopup<boolean>(RegisterCheck).then((result) => {
        if(result) {
          popupService.showPopup(AuthForm) ;
        } else {
          popupService.showPopup(RegForm);
        }
      });
    }
  }

  hide():void {
    this.node.classList.add(headerStyles.default_hidden);
  }

  show():void {
    this.node.classList.remove(headerStyles.default_hidden);
  }
}

export default AboutPage;