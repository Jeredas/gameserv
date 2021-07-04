import { popupService } from './components/popupService/popupService';
import Control from './components/utilities/control';
import CheckSession from './components/temporary/checkSession';

class Application extends Control {
  constructor(parentNode:HTMLElement) {
    super(parentNode, 'div', 'app');
    popupService.init(parentNode);
    popupService.showPopup(CheckSession);
  }
} 

export default Application;