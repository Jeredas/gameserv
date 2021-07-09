import Control from "../utilities/control";
import MainViewInput from "./mainViewInput/mainViewInput";
import mainViewStyles from './mainView.module.css';
import MainViewMessages from "./mainViewMessages";
import MainViewPlayers from "./mainViewPlayers/mainViewPlayers";

class MainView extends Control {
  public mainViewAction: Control;
  public mainViewMessages: MainViewMessages;

  public onMessageSend: (message: string) => void = () => {};
  public mainViewInput: MainViewInput;
  public mainViewPlayers: MainViewPlayers;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', mainViewStyles.chat_main);
    this.mainViewAction = new Control(this.node, 'div', mainViewStyles.chat_action);
    // // this.chatAction.node.style.backgroundImage = `url(${bgImage})`;
    this.mainViewMessages = new MainViewMessages(this.node);
    this.mainViewInput = new MainViewInput(this.node);
    
  }


}

export default MainView;
