import { AuthModel } from './../authModel/authModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../popups/genericPopup/genericPopup';
import stylePopup from '../popups/popupService/popupService.module.css';
import Control from '../utilities/control';

class CheckSession extends GenericPopup<boolean> {
  ButtonYes: ButtonDefault;
  ButtonNo: ButtonDefault;
  popupWrapper: Control;
  model: AuthModel;
  onSelect: (value: boolean) => void;
  spinner: Control;
  title: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.popupWrapper.node.classList.add(stylePopup.check_popup)
    this.model = new AuthModel();
    this.title = new Control(this.popupWrapper.node, 'div', stylePopup.title_check);
    this.spinner = new Control(this.popupWrapper.node, 'div', stylePopup.loader);
    this.tryConnect();
  }

  tryConnect(count: number = 0) {
    if (count > 5) {
      this.spinner.node.classList.add(stylePopup.default_hidden);
      this.title.node.textContent =  'Cannot connect to server. Press button below';
      const btnConnect = new ButtonDefault(
        this.popupWrapper.node,
        stylePopup.settings_button,
        'Connect'
      );
      btnConnect.onClick = () => {
        btnConnect.destroy();
        this.tryConnect(0);
      };
    } else {
      this.title.node.textContent = 'Trying to connect to server';
      this.spinner.node.classList.remove(stylePopup.default_hidden);
      this.model
        .testAccess()
        .then((res) => {
          if (res) {
            this.onSelect(true);
          } else {
            this.onSelect(false);
          }
        })
        .catch((err) => {
          this.tryConnect(count + 1);
        });
    }
  }
}

export default CheckSession;
