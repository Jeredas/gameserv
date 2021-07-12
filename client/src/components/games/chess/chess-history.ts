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

  private getTimeString(time: number): string {
    time = time / 1000;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minOutput}:${secOutput}`;
  }
  private coordToString(coord: Vector): string {
    const NOVEMDECIMAL_BASE = 19;
    const BOARD_SIZE = 8;
    return Number(coord.x + 10).toString(NOVEMDECIMAL_BASE) + (BOARD_SIZE - coord.y);
  }
  setHistoryMove(params: IChessHistory | null): void {
    if (params !== null) {
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
      historyText.node.textContent = `${this.coordToString(from)}-${this.coordToString(to)} ${this.getTimeString(params.time)}`;
    }
  }

  changeHeight(size: number): void {
    this.node.style.setProperty('--size', `${size}px`);
  }
}

export default ChessHistoryBlock;
