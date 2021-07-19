import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import chessStyles from './chess-game.module.css';

class ChessCell extends Control {
  public onCellClick: (coords: Vector) => void = () => {};

  private coords: Vector;

  constructor(parentNode: HTMLElement, coords: Vector, cellColor: string, cellSize: number) {
    super(parentNode, 'div', chessStyles.chess_cell);
    this.node.classList.add(cellColor);
    this.coords = coords;

    this.node.onclick = () => {
      this.onCellClick(this.coords);
    };
  }

  getCellCoord(): Vector {
    return this.coords;
  }

  clearCell(): void {
    this.node.classList.remove('clicked');
    this.node.textContent = '';
  }

  setAllowedMove(): void {
    this.node.classList.add(chessStyles.valid_move);
  }

  removeAllowedMove(): void {
    this.node.classList.remove(chessStyles.valid_move);
  }

  setKingCell(): void {
    this.node.classList.add(chessStyles.king_check);
  }

  removeKingCell(): void {
    this.node.classList.remove(chessStyles.king_check);
  }

  setRivalMove(): void {
    this.node.classList.add(chessStyles.king_rival_check);
  }

  removeRivalMove(): void {
    this.node.classList.remove(chessStyles.king_rival_check);
  }

  setMateMove(): void {
    this.node.classList.add(chessStyles.king_rival_mate);
  }

  removeMateMove(): void {
    this.node.classList.remove(chessStyles.king_rival_mate);
  }

  setRecommendedMove(): void {
    this.node.classList.add(chessStyles.recommended_move);
  }

  removeRecommendedMove(): void {
    this.node.classList.remove(chessStyles.recommended_move);
  }
}

export default ChessCell;
