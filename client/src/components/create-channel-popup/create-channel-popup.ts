import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import chatStyles from '../chatPage/chatPage.module.css';
import Input from '../inputDefault/inputDefault';

export const gameModePopup = [ 'oneScreen', 'network', 'bot' ];
export const channelTypePopup = [ 'OnlyChatChannel', 'ChessGameChannel', 'CrossGameChannel' ];

class CreateChannelPopup extends GenericPopup<any> {
  channelName: InputWrapper;

  oneScreen: InputWrapper;

  network: InputWrapper;

  bot: InputWrapper;

  popupWrapper: Control;

  createButton: ButtonDefault;

  cancelButton: ButtonDefault;

  onSelect: (value: any) => void;
  private channelTypes: Array<Input> = [];
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
    channelTypePopup.forEach((type, i) => {
      const radioWrapper = new Control(this.popupWrapper.node, 'div');
      const radio = new Input(radioWrapper.node, 'radio', 'channelType', type);
      if (i === 0) {
        radio.setChecked(true);
      }
      const label = new Control(radioWrapper.node, 'label', '', type);
      label.node.setAttribute('for', 'channelType');
      this.channelTypes.push(radio);
    });
    gameModePopup.forEach((mode, i) => {
      const radioWrapper = new Control(this.popupWrapper.node, 'div');
      const radio = new Input(radioWrapper.node, 'radio', 'gameMode', mode);
      if (i === 1) {
        radio.setChecked(true);
      }
      const label = new Control(radioWrapper.node, 'label', '', mode);
      label.node.setAttribute('for', 'gameMode');
      this.gameModes.push(radio);
    });
    this.createButton = new ButtonDefault(
      this.popupWrapper.node,
      chatStyles.default_button,
      'create'
    );
    this.cancelButton = new ButtonDefault(
      this.popupWrapper.node,
      chatStyles.default_button,
      'cancel'
    );

    this.cancelButton.onClick = () => {
      this.destroy();
    };

    this.createButton.onClick = () => {
      const channelType = this.channelTypes
        .find((type) => type.getCheckedStatus() === true)
        .getValue();
      const gameMode = this.gameModes.find((mode) => mode.getCheckedStatus() === true).getValue();

      const newChannel = {
        channelName: this.channelName.getValue(),
        channelType: channelType,
        gameMode: gameMode
      };
      this.onSelect(newChannel);
    };
  }
}

export default CreateChannelPopup;
