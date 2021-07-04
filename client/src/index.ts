import Control from './components/control';
import {popupService1} from './components/popupService/popupService';
import './components/popupService/popupService.css';
import indexStyles from './index.css';
import './style.css';

const root = new Control(document.body, 'div', indexStyles.root);

(window as any).popupService1 = popupService1;
// popupService1.init(root.node)