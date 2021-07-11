import Control from '../utilities/control';
import Record from './record';
import recordStyles from './recordPage.module.css';

export interface IGameRecord {
  date: string;
  player1: string;
  player2: string;
  winner: string;
  time: string;
  link: string;
}

const chessRecord = [
  {
    date: '11.07.2021',
    player1: 'Player1',
    player2: 'Player2',
    winner: 'Player1',
    time: '02:53',
    link: 'link to DB'
  }
];

const tableHeader = ['Date', 'Players', 'Winner', 'Time', ''];

class RecordPage extends Control {
  private chessRecordBlock: Control;
  private recordChess: Array<Record>;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', recordStyles.record_wrapper);
    const title = new Control(this.node, 'div', recordStyles.record_title);
    title.node.textContent = 'Game Statistics';

    this.chessRecordBlock = new Control(this.node, 'div', recordStyles.record_table_wrapper);
    const chessTitle = new Control(this.chessRecordBlock.node, 'div', );
    chessTitle.node.textContent = 'Chess';
    const chessTableTitle = new Control(
      this.chessRecordBlock.node,
      'div',
      recordStyles.record_table_header
    );
    tableHeader.forEach((item) => {
      const headerItem = new Control(chessTableTitle.node, 'div');
      headerItem.node.textContent = item;
    })
    

    this.addRecordToChess(chessRecord);
  }

  addRecordToChess(records: Array<IGameRecord>): void {
    this.recordChess = records.map((record) => {
      const tableLine = new Record(this.chessRecordBlock.node, record);
      return tableLine;
    });
  }

  hide(): void {
    this.node.classList.add(recordStyles.default_hidden);
  }

  show(): void {
    this.node.classList.remove(recordStyles.default_hidden);
  }
}

export default RecordPage;
