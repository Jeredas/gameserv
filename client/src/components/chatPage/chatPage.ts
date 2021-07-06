import Control from '../utilities/control';
import ChatChannelsWrapper from '../chatPage/chat-channels-wrapper/chat-channels-wrapper';
import chatStyles from './chatPage.module.css';
import ChatMessagesBlock from '../chatPage/chat-messages/chat-messages';
import ChatInputWrapper from '../chatPage/chat-input-wrapper/chat-input-wrapper';
import ChatUsersWrapper from '../chatPage/chat-users-wrapper/chat-users-wrapper';

class ChatPage extends Control {
  channelBlock: ChatChannelsWrapper;

  chatMain: Control

  chatAction: Control;

  chatUsers:ChatUsersWrapper;

  messageContainer: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', chatStyles.chat_wrapper);
    this.channelBlock = new ChatChannelsWrapper(this.node); //langConfig.chat.channels
    this.chatMain = new Control(this.node, 'div', chatStyles.chat_main);
    this.chatAction = new Control(this.chatMain.node, 'div', chatStyles.chat_action); 
    // this.chatAction.node.style.backgroundImage = `url(${bgImage})`;
    const chatMessages = new ChatMessagesBlock(this.chatMain.node);
    const chatInputBlock = new ChatInputWrapper(this.chatMain.node);
    this.chatUsers = new ChatUsersWrapper(this.node);

    this.messageContainer = new Control(this.node);
  }

  hide():void {
    this.node.classList.add(chatStyles.default_hidden);
  }

  show():void {
    this.node.classList.remove(chatStyles.default_hidden);
  }
}

export default ChatPage;
