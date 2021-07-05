import Control from '../../utilities/control';
import ButtonDefault from '../../buttonDefault/buttonDefault';
// import StylesChat from '../chatPage';
import '../chatPage.css';
import { IChannelBtn, IChannelWrapper } from '../../utilities/interfaces';
import { popupService } from '../../popupService/popupService';
import SettingsChannel from '../../settings-channel/settings-channel';

class ChatChannelsWrapper extends Control {

  private chatChannels: Control;

  public onChannelClick: (name: string) => void;

  public onAddBtnClick: () => void;

  // private configView: IChannelWrapper;

  private channelAddBtn: ButtonDefault;

  constructor(parentNode: HTMLElement, configView: IChannelWrapper, configLang: IChannelBtn) {
    super(parentNode, 'div', configView.wrapper);
    // this.configView = configView;
    const chatChannelControl = new Control(this.node, 'div');
    this.channelAddBtn = new ButtonDefault(chatChannelControl.node, 'default_button' , 'add channel');
    this.channelAddBtn.onClick = () => {
      popupService.showPopup(SettingsChannel);
      // this.onAddBtnClick();
    };
    this.chatChannels = new Control(this.node, 'div');
  }
}

export default ChatChannelsWrapper;
