import ButtonDefault from "../../buttonDefault/buttonDefault";
import GenericPopup from "../genericPopup/genericPopup";
import Input from "../../inputDefault/inputDefault";
import Control from "../../utilities/control";
import popupStyles from '../popupService/popupService.module.css';
import { chessBotPopupComplexity } from "../../utilities/configPopup";

export class ComplexityBotPopup extends GenericPopup<string> {

  createButton: ButtonDefault;
  cancelButton: ButtonDefault;

  private complexities: Array<Input> = [];

  onSelect: (value: string) => void;
  constructor(parentNode: HTMLElement) {
    super(parentNode);
    this.popupWrapper.node.classList.add(popupStyles.complexity_popup);
    const titleComplexity = new Control(this.popupWrapper.node, 'div', popupStyles.title_complexity, 'Choose the difficulty of the bot');
    const wrapperAllRadioBtns = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_all_radio_btns);
    chessBotPopupComplexity.forEach((complexity, i) => {
      const radioWrapper = new Control(wrapperAllRadioBtns.node, 'div', popupStyles.radio_wrapper);
      const radio = new Input(radioWrapper.node, 'radio', 'gameMode', complexity);
      radio.node.classList.add(popupStyles.input_radio)
      radio.node.id = complexity;
      if (i === 0) {
        radio.setChecked(true);
      }
      const label = new Control(radioWrapper.node, 'label', popupStyles.label_radio, complexity);
      label.node.setAttribute('for', complexity);
      this.complexities.push(radio);
    });
    const wrapperBtns = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_btns);

    this.createButton = new ButtonDefault(
      wrapperBtns.node,
      popupStyles.settings_button,
      'Create'
    );
    this.cancelButton = new ButtonDefault(
      wrapperBtns.node,
      popupStyles.settings_button,
      'Cancel'
    );

    this.createButton.onClick = () => {
      const currentComplexity = this.complexities.find((mode) => mode.getCheckedStatus() === true).getValue();
      this.onSelect(currentComplexity);
    };

    this.cancelButton.onClick = () => {
      this.destroy();
    }
  }
}