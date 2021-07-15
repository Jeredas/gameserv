import { IChessHistory, ICrossHistory, IPublicUserInfo } from './../utilities/interfaces';
import { RecordModel } from './recordModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';
import Record from './record';
import recordStyles from './recordPage.module.css';

export interface IGameRecord {
  gameType:string;
  date: string;
  player1: IPublicUserInfo;
  player2: IPublicUserInfo;
  winner: string;
  time: string;
  history:Array<IChessHistory>|Array<ICrossHistory>;
  gameMode:string;
  moves:Array<{ field: string; player: string; history: IChessHistory}>
}


const tableHeader = ['Date', 'Players', 'Winner', 'Time', ''];

class RecordPage extends Control {
  private chessRecordBlock: Control;
  private recordChess: Array<Record>;
  model : RecordModel = new RecordModel();
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', recordStyles.record_wrapper);
    const title = new Control(this.node, 'div', recordStyles.record_title);
    title.node.textContent = 'Game Statistics';
    
    this.chessRecordBlock = new Control(this.node, 'div', recordStyles.record_table_wrapper);
    const chessTitle = new Control(this.chessRecordBlock.node, 'div', );
    const refreshBtn = new ButtonDefault(this.node, recordStyles.record_button, 'Refresh');
    refreshBtn.onClick = () => {
      this.model.getStatistic().then(async (res: Array<IGameRecord>) => {
        this.addRecordToChess(res);
      })
    }
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

    this.model.getStatistic().then(async (res: Array<IGameRecord>) => {
      this.addRecordToChess(res);
    })
  }

  async addRecordToChess(records: Array<IGameRecord>): Promise<void> {
    this.chessRecordBlock.node.innerHTML='';
        const chessTableTitle = new Control(
          this.chessRecordBlock.node,
          'div',
          recordStyles.record_table_header
        );
        tableHeader.forEach((item) => {
          const headerItem = new Control(chessTableTitle.node, 'div');
          headerItem.node.textContent = item;
        })
        const stats = await records;
        stats.forEach((game) => {
          new Record(this.chessRecordBlock.node,game)
        })
  }

  hide(): void {
    this.node.classList.add(recordStyles.default_hidden);
  }

  show(): void {
    this.node.classList.remove(recordStyles.default_hidden);
  }
}

export default RecordPage;
