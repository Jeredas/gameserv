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

class AboutPage extends Control {
  wrapper:Control;
  buttonLogIn: ButtonDefault;
  onSelect: (value: any) => void;
  onAuth: Signal<IUserAuth>
  onAuthFail: Signal<string> = new Signal();
  constructor(parentNode:HTMLElement) {
    super(parentNode, 'div', 'about_page');
    this.onAuth = new Signal()
    this.wrapper = new Control(this.node);
    this.wrapper.node.innerHTML = `
    <div>Welcome dear Guest!</div>
    <div>You are about to start an adventure with a humble set of games on our site.</div>
    <div>What you need is only to press the big button below to sign in and enter the game page to chat with friends, participate in a game of your choice or just enjoy with other players' matches.</div>
    `;
    
    this.buttonLogIn = new ButtonDefault(this.node, stylePopup.settings_button, 'log in');

    this.buttonLogIn.onClick = () => {
      this.hide()
      popupService.init(parentNode);
      popupService.showPopup(RegisterCheck).then((res)=>{
        if(res === 'SignUp'){
          popupService.showPopup(RegForm).then((res) => {
            if (res === 'register') {
              console.log('registered');
              this.showAuthPopUp().then((res)=>{
                if(res.status ===true){
                  this.onAuth.emit(res.data)
                 } else {
                   this.onAuthFail.emit('fail')
                 }
              })
            } else {
              this.onAuthFail.emit('fail')
              this.show();
              console.log('registration failed');
            }
          });
        } else if(res === 'SignIn'){
        this.showAuthPopUp().then((res)=>{
         if(res.status ===true){
          this.onAuth.emit(res.data)
         } else {
           this.onAuthFail.emit('fail')
         }
        })
        } else if(res === 'Close'){
          this.show();
          //this.onAuthFail.emit('fail')
        }
      })
    }
  }

  hide():void {
    this.node.classList.add(headerStyles.default_hidden);
  }

  show():void {
    this.node.classList.remove(headerStyles.default_hidden);
  }
  private showAuthPopUp() {
    return popupService.showPopup<{ status: string, data: IUserAuth }>(AuthForm).then((res) => {
      if (res.status === 'login') {
        console.log(res.data,'res data')
        return {status:true, data:res.data};
      } else {
        this.show();
        return {status:false};
      }
    })
  }
}

export default AboutPage;