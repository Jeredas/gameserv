import Control from '../utilities/control';
import recordStyles from './recordPage.module.css';

const tableHeader = [
  {
    name: 'Game',
    class: recordStyles.record_game_name
  },
  {
    name: 'Date',
    class: recordStyles.record_date
  },
  {
    name: 'Players',
    class: recordStyles.record_players
  },
  {
    name: 'Winner',
    class: recordStyles.record_winner
  },
  {
    name: 'Game mode',
    class: recordStyles.record_mode
  },
  {
    name: 'Time/Watch Replay',
    class: recordStyles.record_time_watch
  }
];

class RecordHeader extends Control {
  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', recordStyles.record_table_header);
    tableHeader.forEach((tableItem) => {
      const item = new Control(this.node, 'div', tableItem.class);
      item.node.textContent = tableItem.name;
    });
  }
}

export default RecordHeader;
