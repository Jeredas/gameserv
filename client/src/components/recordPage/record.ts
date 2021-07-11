import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';
import { IGameRecord } from './recordPage';
import recordStyles from './recordPage.module.css';

class Record extends Control {
  chessRecordBlock: Control;
  
  constructor(parentNode: HTMLElement, record: IGameRecord) {
    super(parentNode, 'div', recordStyles.record_line);
    const recordDate = new Control(this.node, 'div', recordStyles.record_date);
    recordDate.node.textContent = record.date;

    const recordPlayers = new Control(this.node, 'div', recordStyles.record_players);
    recordPlayers.node.textContent = `${record.player1} vs ${record.player2}`;

    const recordWinner = new Control(this.node, 'div', recordStyles.record_winner);
    recordWinner.node.textContent = record.winner;

    const recordTime = new Control(this.node, 'div', recordStyles.record_time);
    recordTime.node.textContent = record.time;

    const brnWatch = new ButtonDefault(this.node, recordStyles.record_button, 'Watch');
  }
}

export default Record