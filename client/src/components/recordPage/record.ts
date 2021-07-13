import { RecordModel } from './recordModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';
import { IGameRecord } from './recordPage';
import recordStyles from './recordPage.module.css';

class Record extends Control {
  chessRecordBlock: Control;
  model: RecordModel = new RecordModel();

  constructor(parentNode: HTMLElement, record: IGameRecord) {
    super(parentNode, 'div', recordStyles.record_line);
    const gameType = new Control(this.node, 'div', recordStyles.record_date);
    gameType.node.textContent = record.gameType;
    const recordDate = new Control(this.node, 'div', recordStyles.record_date);
    recordDate.node.textContent = record.date;
    
    const recordPlayers = new Control(this.node, 'div', recordStyles.record_players);

    const player1container = new Control(recordPlayers.node, 'div', recordStyles.record_playerContainer);
    const player1Avatar = new Control(player1container.node,'div', recordStyles.record_avatar);
    player1Avatar.node.style.backgroundImage = `url(${record.player1.avatar})`;
    const player1Name = new Control(player1container.node,'div', recordStyles.record_playerNames);
    player1Name.node.textContent = `${record.player1.login}`
    const vs =  new Control(player1container.node,'div', recordStyles.record_playerNames);
    vs.node.textContent = 'vs';
    const player2container = new Control(recordPlayers.node, 'div', recordStyles.record_playerContainer);
    const player2Avatar = new Control(player2container.node,'div', recordStyles.record_avatar)
    player2Avatar.node.style.backgroundImage = `url(${record.player2.avatar})`;
    const player2Name = new Control(player2container.node,'div', recordStyles.record_playerNames)
    player2Name.node.textContent = `${record.player2.login}`;
    
  

    const recordWinner = new Control(this.node, 'div', recordStyles.record_winner);
    recordWinner.node.textContent = record.winner;

    const recordTime = new Control(this.node, 'div', recordStyles.record_time);
    recordTime.node.textContent = record.time;

    const brnWatch = new ButtonDefault(this.node, recordStyles.record_button, 'Watch');
    brnWatch.onClick = () => {
      console.log('watch replay')
    }
  }
}

export default Record