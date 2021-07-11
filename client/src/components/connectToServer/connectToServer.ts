import { SocketClient } from '../../socketClient/socketClient';
import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import popupStyles from '../popupService/popupService.module.css';
import Control from '../utilities/control';

class ConnectToServer extends GenericPopup<boolean>{
  onClick: () => void
  private openHandler: ()=> void;
  private closeHandler: ()=> void;
  private client: SocketClient;

  constructor(parentNode: HTMLElement, params: {client: SocketClient}) {
    super(parentNode);
    this.popupWrapper.node.classList.add(popupStyles.reconnect_popup);
    this.client = params.client;
    const title = new Control(this.popupWrapper.node, 'div', popupStyles.reconnect_title, 'Unfortunately, there was an unexpected disconnection from the server, click on the button below to reconnect');
    const button = new ButtonDefault(this.popupWrapper.node, popupStyles.settings_button, 'Reconnect');
    this.openHandler = () => this.onSelect(true);
    this.closeHandler = () => button.buttonEnable();

    this.client.onOpen.add(this.openHandler);
    this.client.onClose.add(this.closeHandler);
    button.node.onclick = () => {
      this.client.reconnent();
      button.buttonDisable();
    }
  }

  destroy() {
    this.client.onOpen.remove(this.openHandler);
    this.client.onClose.remove(this.closeHandler);
    super.destroy();
  }
}

export default ConnectToServer;