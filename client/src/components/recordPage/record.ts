import { popupService } from './../popupService/popupService';
import { Replay } from './replay';
import { RecordModel } from './recordModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';
import { IGameRecord } from './recordPage';
import recordStyles from './recordPage.module.css';
import { IChessHistory, ICrossHistory } from '../utilities/interfaces';

class Record extends Control {
  chessRecordBlock: Control;
  model: RecordModel = new RecordModel();
  replay: Replay;
  history: Array<IChessHistory> | Array<ICrossHistory>;
  constructor(parentNode: HTMLElement, record: IGameRecord) {
    super(parentNode, 'div', recordStyles.record_line);
    const gameType = new Control(this.node, 'div', recordStyles.record_game_name);
    gameType.node.textContent = record.gameType;

    const gameDate = new Control(this.node, 'div', recordStyles.record_date);
    gameDate.node.textContent = record.date;

    const gamePlayers = new Control(this.node, 'div', recordStyles.record_players);

    const player1 = new Control(gamePlayers.node, 'div', recordStyles.record_player);
    const player1Avatar = new Control(player1.node, 'div', recordStyles.record_player_avatar);
    player1Avatar.node.style.backgroundImage = `url(${record.player1.avatar})`;
    const player1Login = new Control(player1.node, 'div', recordStyles.record_player_login);
    player1Login.node.textContent = record.player1.login;

    const vs = new Control(gamePlayers.node, 'div', recordStyles.record_player_vs);
    vs.node.textContent = 'vs';

    const player2 = new Control(gamePlayers.node, 'div', recordStyles.record_player);
    const player2Avatar = new Control(player2.node, 'div', recordStyles.record_player_avatar);
    player2Avatar.node.style.backgroundImage = `url(${record.player2.avatar})`;
    const player2Login = new Control(player2.node, 'div', recordStyles.record_player_login);
    player2Login.node.textContent = record.player2.login;

    const gameWinner = new Control(this.node, 'div', recordStyles.record_winner);
    gameWinner.node.textContent = record.winner;

    const gameMode = new Control(this.node, 'div', recordStyles.record_mode);
    gameMode.node.textContent = record.gameMode;

    const gameTimeWatch = new Control(this.node, 'div', recordStyles.record_time_watch);
    const gameTime = new Control(gameTimeWatch.node, 'div', recordStyles.record_time);
    
      gameTime.node.textContent = record.time;
    
    const brnWatch = new ButtonDefault(gameTimeWatch.node, recordStyles.record_button, 'Watch');
    brnWatch.onClick = () => {
      popupService
        .showPopup(Replay, {
          history: record.history,
          gameType: record.gameType,
          player1: record.player1,
          player2: record.player2,
          moves: record.moves
        })
        .then((res) => {
          if (res == 'close') {
            console.log('resplay closed');
          }
        });
    };
  }
}

export default Record;
