import Control from '../../utilities/control';
import MainViewPlayer from '../mainViewPlayer/mainViewPlayer';
import mainViewPlayers from '../mainView.module.css';
import { IChannelPlayer } from '../../utilities/interfaces';
import Button from '../button/button';

class MainViewPlayers extends Control {
  private playersBlock: Control;

  private players: Array<MainViewPlayer> = [];

  private playerHeader: any;
  private controlBlock: Control;
  private btnEnter: Button;
  private btnLeave: Button;
  public onGameEnter: () => void = () => {};
  public onChannelLeave: () => void = () => {};
  private btnRecommend: Button;
  public onMoveRecommended: () => void = () => {};

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', mainViewPlayers.chat_players);
    this.controlBlock = new Control(this.node, 'div', mainViewPlayers.chat_category);
    this.playersBlock = new Control(this.node, 'div', mainViewPlayers.chat_category);

    this.btnEnter = new Button(this.controlBlock.node, 'Enter the game');
    this.btnRecommend = new Button(this.controlBlock.node, 'Recommend moves');
    this.hideRecommend();
    this.btnEnter.onClick = () => {
      this.onGameEnter();
    };

    this.btnRecommend.onClick = () => {
      this.onMoveRecommended();
    };

    this.playerHeader = new Control(
      this.playersBlock.node,
      'div',
      mainViewPlayers.chat_category_name
    );
    this.playerHeader.node.textContent = 'Players: ';
  }

  setPlayers(players: Array<IChannelPlayer>): void {
    this.deletePlayers();
    players.forEach((player) => {
      const chatPlayer = new MainViewPlayer(this.playersBlock.node, player.avatar, player.login);
      this.players.push(chatPlayer);
    });
  }

  deletePlayer(playerName: string): void {
    this.players = this.players.map((player) => {
      if (player.getUserName() === playerName) {
        player.destroy();
      } else return player;
    });
  }

  deletePlayers(): void {
    this.players.forEach((player) => {
      player.destroy();
    });
    this.players = [];
  }

  getPlayersLength(): number {
    return this.players.length;
  }

  showRecommend(): void {
    this.btnRecommend.buttonShow();
    this.btnEnter.buttonHide();
  }

  hideRecommend(): void {
    this.btnRecommend.buttonHide();
    this.btnEnter.buttonShow();
  }
}

export default MainViewPlayers;
