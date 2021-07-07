import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import historyStyles from './crossHistory.module.css'

class HistoryBlock extends Control {
  private historyWrapper: Control;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', historyStyles.cross_history);
    const historyHeader = new Control(this.node, 'div', historyStyles.cross_history_header);
    historyHeader.node.textContent = 'History: ';
    this.historyWrapper = new Control(this.node, 'div', historyStyles.cross_history_item);
  }

  setHistoryMove(sigh: string, coords: Vector, time: string): void {
    const historyItem = new Control(this.historyWrapper.node, 'div', historyStyles.cross_history_item);
    historyItem.node.textContent = `${sigh} ${coords.x}-${coords.y} ${time}`;
  }
}

export default HistoryBlock;
