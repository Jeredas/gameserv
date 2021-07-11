import { AuthModel } from './../authModel/authModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import stylePopup from '../popupService/popupService.module.css';
import Control from '../utilities/control';

class CheckSession extends GenericPopup<boolean> {
  ButtonYes: ButtonDefault;
  ButtonNo: ButtonDefault;
  popupWrapper: Control;
  // onShowAbout: () => void;
  // onShowChat: () => void;
  model: AuthModel;
  onSelect: (value: boolean) => void;
  spinner: Control;
  title: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.model = new AuthModel();
    this.title = new Control(this.popupWrapper.node, 'div', '');
    this.spinner = new Control(this.popupWrapper.node, 'div', stylePopup.loader);
    // this.ButtonYes = new ButtonDefault(this.popupWrapper.node,stylePopup.popup_default_button, 'yes');
    // this.ButtonNo = new ButtonDefault(this.popupWrapper.node,stylePopup.popup_default_button, 'no');

    // this.ButtonYes.onClick = () => {
    //   this.onSelect(true)
    // }
    // this.ButtonNo.onClick = () => {
    //   console.log('show abot page with sign in button');
    //   this.onSelect(false)
    //}
    this.tryConnect();
  }

  tryConnect(count: number = 0) {
    if (count > 5) {
      this.spinner.node.style.display = 'none';
      this.title.node.textContent =  'Cannot connect to server. Press button below';
      const btnConnect = new ButtonDefault(
        this.popupWrapper.node,
        stylePopup.popup_default_button,
        'Connect'
      );
      btnConnect.onClick = () => {
        btnConnect.destroy();
        this.tryConnect(0);
      };
    } else {
      this.title.node.textContent =  'Trying to connect to server';
      this.spinner.node.style.display = '';
      this.model
        .testAccess()
        .then((res) => {
          console.log(res);
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
