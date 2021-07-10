import Control from '../../utilities/control';
import MainViewPlayer from '../mainViewPlayer/mainViewPlayer';
import mainViewPlayers from '../mainView.module.css';
import CrossButton from '../../games/cross/button/cross-button';

class MainViewPlayers extends Control {
  private playersBlock: Control;

  private players: Array<MainViewPlayer> = [];

  private playerHeader: any;
  private controlBlock: Control;
  private btnEnter: CrossButton;
  private btnLeave: CrossButton;
  public onGameEnter: () => void = () => {};
  public onChannelLeave: () => void = () => {};

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', mainViewPlayers.chat_players);
    this.controlBlock = new Control(this.node, 'div', mainViewPlayers.chat_category);
    this.playersBlock = new Control(this.node, 'div', mainViewPlayers.chat_category);

    this.btnEnter = new CrossButton(this.controlBlock.node, 'Enter the game');
    this.btnEnter.onClick = () => {
      this.onGameEnter();
    };

    this.playerHeader = new Control(
      this.playersBlock.node,
      'div',
      mainViewPlayers.chat_category_name
    );
    this.playerHeader.node.textContent = 'Players: ';
  }

  setPlayers(players: Array<{ login: string; avatar: string }>): void {
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
}

export default MainViewPlayers;
