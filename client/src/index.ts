import Control from './components/utilities/control';
import Application from './app'
import { popupService } from './components/popupService/popupService';
//import './components/popupService/popupService.css';
// import indexStyles from './index.css';
import './style.css';

// const root = new Control(document.body, 'div', indexStyles.root);

const app = new Application(document.body);

(window as any).popupService = popupService;
// popupService1.init(root.node)