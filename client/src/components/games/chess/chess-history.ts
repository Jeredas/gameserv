import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import chessStyles from './chess-game.module.css';
import configFigures from './config-chess';

class ChessHistoryBlock extends Control {
  private historyWrapper: Control;

  private historyHeader: Control;

  constructor(parentNode: HTMLElement, parentHeight: number) {
    super(parentNode, 'div', chessStyles.chess_history);
    this.node.style.setProperty('--size', `${parentHeight}px`);
    this.historyHeader = new Control(this.node, 'div', chessStyles.chess_history_header);
    this.historyHeader.node.textContent = 'History: ';
    this.historyWrapper = new Control(this.node, 'div');
  }

  setHistoryMove(coords: Array<Array<Vector>>, time: string, figName: Array<string>): void {
    coords.forEach((coord, i) => {
      const historyItem = new Control(
        this.historyWrapper.node,
        'div',
        chessStyles.chess_history_item
      );
      const historyFigure = new Control(historyItem.node, 'div', chessStyles.chess_history_figure);
      historyFigure.node.style.backgroundImage = `url(${configFigures.get(figName[i])})`;
      const historyText = new Control(historyItem.node, 'div');

      historyText.node.textContent = `${coord[0].x}${coord[0].y}-${coord[1].x}${coord[1]
        .y} ${time}`;
    });
  }

  changeHeight(size: number): void {
    this.node.style.setProperty('--size', `${size}px`);
  }
}

export default ChessHistoryBlock;
