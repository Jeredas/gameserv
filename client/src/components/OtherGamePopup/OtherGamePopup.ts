import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import popupStyles from '../popupService/popupService.module.css';
import { IChannelData } from '../utilities/interfaces';

interface IChannelPopupOtherLangs{
  titleNameChannel: string,
  placeHolder: string,
  createButtonText: string,
  cancelButtonText: string,
  noteText: string,
}

const joinChannelPopupLangEn:IChannelPopupOtherLangs = {
  titleNameChannel: 'Enter the channel name*',
  placeHolder: 'Name Channel',
  createButtonText: 'Create',
  cancelButtonText: 'Cancel',
  noteText: 'Note: *the created channel will be intended for interaction via the Internet',
}

class OtherGamePopup extends GenericPopup<IChannelData> {
  protected popupWrapper: Control;

  private channelName: InputWrapper;

  private createBtn: ButtonDefault;

  private cancelBtn: ButtonDefault;

  public onSelect: (value: IChannelData) => void;

  constructor(parentNode:HTMLElement, langConfig:IChannelPopupOtherLangs = joinChannelPopupLangEn) {
    super(parentNode);
    this.channelName = new InputWrapper(this.popupWrapper.node, langConfig.titleNameChannel, () => null, langConfig.placeHolder, '', 'text');
    this.popupWrapper.node.classList.add(popupStyles.wrapper_join);
    const note = new Control(this.popupWrapper.node, 'div', popupStyles.note, langConfig.noteText);
    const wrapperBtns = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_btns);
    this.createBtn = new ButtonDefault(wrapperBtns.node, popupStyles.settings_button, langConfig.createButtonText);
    this.cancelBtn = new ButtonDefault(wrapperBtns.node, popupStyles.settings_button, langConfig.cancelButtonText);

    this.createBtn.buttonDisable(popupStyles.settings_button_disabled);
    this.channelName.onValueEnter = (value: string) => {
      if(value) {
        this.createBtn.buttonEnable(popupStyles.settings_button_disabled);
      } else {
        this.createBtn.buttonDisable(popupStyles.settings_button_disabled);
      }
    }

    this.createBtn.onClick = () => {
        const newChannel = {
          channelName: this.channelName.getValue(),
          channelType: 'OnlyChatChannel',
          gameMode: 'network'
        };
        this.onSelect(newChannel);
    }

    this.cancelBtn.onClick = () => {
      this.destroy();
    }
  }
}

export default OtherGamePopup;