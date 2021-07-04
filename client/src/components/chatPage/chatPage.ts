import Control from '../utilities/control';
import ChatChannelsWrapper from '../chatPage/chat-channels-wrapper/chat-channels-wrapper';
import headerStyles from '../header/header.css';
// import chatStyles from './chatPage.css';
import chatConfigView from '../utilities/config-chat';
import ChatMessagesBlock from '../chatPage/chat-messages/chat-messages';
import ChatInputWrapper from '../chatPage/chat-input-wrapper/chat-input-wrapper';
import ChatUsersWrapper from '../chatPage/chat-users-wrapper/chat-users-wrapper';
import { langConfigEn, langConfigRu } from '../utilities/lang-config';

const langConfig = langConfigEn;

class ChatPage extends Control {
  channelBlock: ChatChannelsWrapper;

  chatMain: Control

  chatAction: Control;

  chatUsers:ChatUsersWrapper;

  messageContainer: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatConfigView.wrapper);
    this.channelBlock = new ChatChannelsWrapper(this.node, chatConfigView.channelWrapper, langConfig.chat.channels);
    this.chatMain = new Control(this.node, 'div', chatConfigView.main);
    this.chatAction = new Control(this.chatMain.node, 'div', chatConfigView.action);
    // this.chatAction.node.style.backgroundImage = `url(${bgImage})`;
    const chatMessages = new ChatMessagesBlock(this.chatMain.node, chatConfigView.messageWrapper);
    const chatInputBlock = new ChatInputWrapper(this.chatMain.node, chatConfigView.inputWrapper, langConfig.chat.messages);
    this.chatUsers = new ChatUsersWrapper(this.node, chatConfigView.users, langConfig.chat.users);

    this.messageContainer = new Control(this.node);
  }



  hide():void {
    this.node.classList.add(headerStyles.default_hidden);
  }

  show():void {
    this.node.classList.remove(headerStyles.default_hidden);
  }
}

export default ChatPage;
