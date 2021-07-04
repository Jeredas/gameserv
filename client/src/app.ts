import { popupService } from './components/popupService/popupService';
import Control from './components/utilities/control';
import CheckSession from './components/temporary/checkSession';
import { Navigation } from './components/header/navigation';
import AboutPage from './components/AboutPage/aboutPage';
import { IPageComponent } from './components/utilities/interfaces';
import { Router } from './components/router/router';
import { Route } from './components/router/route';
import { RegForm } from './components/regForm/regForm';
import SettingsUser from './components/settingsUser/settingsUser';
import { AuthForm } from './components/authForm/authForm';


class Application extends Control {
  navigation: Navigation;

  router: Router;

  about: AboutPage;

  pageContainer: Control;

  constructor(parentNode:HTMLElement) {
    super(parentNode, 'div', 'app');
    popupService.init(parentNode);
    popupService.showPopup(CheckSession).then((res)=>{
      if(res==='no'){
        popupService.showPopup(RegForm).then((res)=>{
          if(res==='register'){
            console.log('registered')
            popupService.showPopup(AuthForm).then((res)=>{
              if(res==='login'){
                //TODO:Переход на chatPage
                console.log("Logged in")
              } else {
                this.about.show();
              }
            })
          } else {
            //TODO:Вовзращает на страницу About , добавить большую кнопку регистрации
            this.about.show()
            console.log('registration failed')
          }
        })
      } else{
        //TODO:Сделать переход на chatPage
        console.log('Go to chat Page')

      } 
    });
  
    // popupService.showPopup(SettingsUser)
    // popupService.showPopup(RegForm);

    this.navigation = new Navigation(this.node);
    this.router = new Router();
    this.pageContainer = new Control(this.node, 'div', '');
    this.about = new AboutPage(this.pageContainer.node);
    this.addPage('about', 'about', this.about);
    this.router.processHash();
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
}

export default Application;