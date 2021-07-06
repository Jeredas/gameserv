import Control from './components/utilities/control';
import Application from './app'
import { popupService } from './components/popupService/popupService';
import './style.css';

const app = new Application(document.body);

(window as any).popupService = popupService;
