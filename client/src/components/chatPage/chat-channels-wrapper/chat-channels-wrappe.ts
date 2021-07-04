import Control from '../../utilities/control';
import ButtonDefault from '../../buttonDefault/buttonDefault';
// import StylesChat from '../chatPage';

class ChatChannelsWrapper extends Control {

  private chatChannels: Control;

  public onChannelClick: (name: string) => void = () => {};

  public onAddBtnClick: () => void = () => {};

  // private configView: IChannelWrapper;

  private channelAddBtn: ButtonDefault;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', 'chat_wrapper');
    // this.configView = configView;
    const chatChannelControl = new Control(this.node, 'div');
    this.channelAddBtn = new ButtonDefault(chatChannelControl.node, 'default_button' , 'add channel');
    this.channelAddBtn.onClick = () => {
      this.onAddBtnClick();
    };
    this.chatChannels = new Control(this.node, 'div');
  }
}

export default ChatChannelsWrapper;
