import Vector from '../../../utilities/vector';
import Control from '../../../utilities/control';
import historyStyles from './crossHistory.module.css'
import { ICrossHistory } from '../../../../components/utilities/interfaces';

class HistoryBlock extends Control {
  private historyWrapper: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', historyStyles.cross_history);
    const historyHeader = new Control(this.node, 'div', historyStyles.cross_history_header);
    historyHeader.node.textContent = 'History: ';
    this.historyWrapper = new Control(this.node, 'div', historyStyles.cross_history_item);
  }

  setHistoryMove(params: ICrossHistory): void {
    const historyItem = new Control(this.historyWrapper.node, 'div', historyStyles.cross_history_item);
    historyItem.node.textContent = `${params.sign} ${params.move.x}-${params.move.y} ${params.time}`;
  }

  clearHistory(): void {
    this.historyWrapper.destroy();
    this.historyWrapper = new Control(this.node, 'div', historyStyles.cross_history_item);
  }
}

export default HistoryBlock;
