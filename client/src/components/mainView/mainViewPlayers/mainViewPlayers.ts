import Control from '../../utilities/control';
import MainViewPlayer from '../mainViewPlayer/mainViewPlayer';
import mainViewPlayers from '../mainView.module.css';

class MainViewPlayers extends Control {
  private playersBlock: Control;

  private players: Array<MainViewPlayer> = [];

  private playerHeader: any;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', mainViewPlayers.chat_users);
    this.playersBlock = new Control(this.node, 'div', mainViewPlayers.chat_category);
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
