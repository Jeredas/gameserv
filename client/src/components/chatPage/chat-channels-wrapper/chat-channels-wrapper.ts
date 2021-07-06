import Control from '../../utilities/control';
import ButtonDefault from '../../buttonDefault/buttonDefault';
import chatStyles from '../chatPage.module.css';
import { popupService } from '../../popupService/popupService';
import SettingsChannel from '../../create-channel-popup/create-channel-popup';
import JoinChannelPopup from '../../join-channel-popup/join-channel-popup';

class ChatChannelsWrapper extends Control {

  private chatChannels: Control;

  public onChannelClick: (name: string) => void;

  public onAddBtnClick: () => void;

  private channelCreateBtn: ButtonDefault;

  private channelJoinBtn: ButtonDefault;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_channels);
    const chatChannelControl = new Control(this.node, 'div');
    this.channelCreateBtn = new ButtonDefault(chatChannelControl.node, chatStyles.default_button, 'create channel');
    this.channelJoinBtn = new ButtonDefault(chatChannelControl.node, chatStyles.default_button, 'join channel');
    this.channelCreateBtn.onClick = () => {
      popupService.showPopup(SettingsChannel);
      // this.onAddBtnClick();
    };

    this.channelJoinBtn.onClick = () => {
      console.log('join');
      popupService.showPopup(JoinChannelPopup);
      // popupService.showPopup(JoinChannelPopup);
      // this.onAddBtnClick();
    };
    this.chatChannels = new Control(this.node, 'div');
  }
}

export default ChatChannelsWrapper;
