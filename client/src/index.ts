import Application from './app'
import './style.css';

const app = new Application(document.body);

// (window as any).popupService = popupService;
(window as any).app = app;
