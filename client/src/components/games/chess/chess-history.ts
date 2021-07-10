import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import chessStyles from './chess-game.module.css';
import configFigures from './config-chess';
import { IChessHistory } from 'src/components/utilities/interfaces';

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

  setHistoryMove(params: IChessHistory): void {
    const historyItem = new Control(
      this.historyWrapper.node,
      'div',
      chessStyles.chess_history_item
    );
    const historyFigure = new Control(historyItem.node, 'div', chessStyles.chess_history_figure);
    historyFigure.node.style.backgroundImage = `url(${configFigures.get(params.figName)})`;
    const historyText = new Control(historyItem.node, 'div');
    const from = params.coords[0];
    const to = params.coords[1];
    historyText.node.textContent = `${from.x}${from.y}-${to.x}${to.y} ${params.time}`;
  }

  changeHeight(size: number): void {
    this.node.style.setProperty('--size', `${size}px`);
  }
}

export default ChessHistoryBlock;
