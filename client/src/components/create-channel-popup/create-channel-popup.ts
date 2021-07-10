import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import chatStyles from '../chatPage/chatPage.module.css';
import Input from '../inputDefault/inputDefault';
import { IChannelData } from '../utilities/interfaces';
import popupStyles from '../popupService/popupService.module.css';

export const gameModePopup = [ 'oneScreen', 'network', 'bot' ];
export const channelTypePopup = [ 'OnlyChatChannel', 'ChessGameChannel', 'CrossGameChannel' ];

class CreateChannelPopup extends GenericPopup<IChannelData> {
  channelName: InputWrapper;

  oneScreen: InputWrapper;

  network: InputWrapper;

  bot: InputWrapper;

  popupWrapper: Control;

  createButton: ButtonDefault;

  cancelButton: ButtonDefault;

  onSelect: (value: IChannelData) => void;
  // private channelTypes: Array<Input> = [];
  private gameModes: Array<Input> = [];

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    
    this.channelName = new InputWrapper(
      this.popupWrapper.node,
      'Name channel',
      () => null,
      'Channel Name',
      'nameChannel'
    );
    this.popupWrapper.node.classList.add(popupStyles.wrapper_settings_game_chess);
    // channelTypePopup.forEach((type, i) => {
    //   const radioWrapper = new Control(this.popupWrapper.node, 'div');
    //   const radio = new Input(radioWrapper.node, 'radio', 'channelType', type);
    //   if (i === 0) {
    //     radio.setChecked(true);
    //   }
    //   const label = new Control(radioWrapper.node, 'label', '', type);
    //   label.node.setAttribute('for', 'channelType');
    //   this.channelTypes.push(radio);
    // });
    const wrapperAllRadioBtns = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_all_radio_btns)
    gameModePopup.forEach((mode, i) => {
      const radioWrapper = new Control(wrapperAllRadioBtns.node, 'div', popupStyles.radio_wrapper);
      const radio = new Input(radioWrapper.node, 'radio', 'gameMode', mode);
      radio.node.classList.add(popupStyles.input_radio)
      radio.node.id = mode;
      if (i === 1) {
        radio.setChecked(true);
      }
      const label = new Control(radioWrapper.node, 'label', popupStyles.label_radio, mode);
      label.node.setAttribute('for', mode);
      this.gameModes.push(radio);
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

    this.cancelButton.onClick = () => {
      this.destroy();
    };

    this.createButton.onClick = () => {
      // const channelType = this.channelTypes
      //   .find((type) => type.getCheckedStatus() === true)
      //   .getValue();
      const gameMode = this.gameModes.find((mode) => mode.getCheckedStatus() === true).getValue();

      const newChannel = {
        channelName: this.channelName.getValue(),
        // channelType: channelType,
        gameMode: gameMode
      };
      this.onSelect(newChannel);
    };
  }
}

export default CreateChannelPopup;
