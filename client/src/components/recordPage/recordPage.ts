import { IChessHistory, ICrossHistory, IUserData  } from '../utilities/interfaces';
import { RecordModel } from './recordModel';
import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';
import Record from './record';
import recordStyles from './recordPage.module.css';
import RecordHeader from './recordHeader';
import recordBg from '../../assets/records.png';

export interface IGameRecord {
  gameType: string;
  date: string;
  player1: IUserData ;
  player2: IUserData ;
  winner: string;
  time: string;
  history: Array<IChessHistory> | Array<ICrossHistory>;
  gameMode: string;
  moves: Array<{ field: string; player: string; history: IChessHistory }>;
}

class RecordPage extends Control {
  private chessRecordBlock: Control;
  private recordChess: Array<Record>;
  model: RecordModel = new RecordModel();
  private tableBody: Control;
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', recordStyles.record_wrapper);
    this.node.style.backgroundImage = `url(${recordBg})`;
    const title = new Control(this.node, 'div', recordStyles.record_title);
    title.node.textContent = 'Game Statistics';

    this.chessRecordBlock = new Control(this.node, 'div', recordStyles.record_table_wrapper);
    const tableHeader = new RecordHeader(this.chessRecordBlock.node);
    
    const refreshBtn = new ButtonDefault(this.node, recordStyles.record_button, 'Refresh');
    refreshBtn.onClick = () => {
      this.model.getStatistic().then(async (res: Array<IGameRecord>) => {
        this.tableBody.destroy();
        this.addRecordToChess(res);
      });
    };

    this.model.getStatistic().then(async (res: Array<IGameRecord>) => {
      this.addRecordToChess(res);
    });
  }

  async addRecordToChess(records: Array<IGameRecord>): Promise<void> {
    const stats = await records;
    this.tableBody = new Control(this.chessRecordBlock.node);
    stats.forEach((game, index) => {
      if (index % 2 !== 0) {
        const recordOdd = new Record(this.tableBody.node, game);
        recordOdd.node.classList.add(recordStyles.odd_record);
      } else {
        const recordEven = new Record(this.tableBody.node, game);
        recordEven.node.classList.add(recordStyles.even_record);
        
      }
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
