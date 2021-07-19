import { ChessColor } from './chess-color';
import { COMMON } from './common';
import { ICellCoord } from './icell-coord';

export class CellCoord implements ICellCoord {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  copy(): CellCoord {
    return new CellCoord(this.x, this.y);
  }
  isCorrect(): boolean {
    return this.x >= 0 && this.x < 8 && this.y >= 0 && this.y < 8;
  }
  toString(): string {
    return Number(this.x + 10).toString(19) + (8 - this.y);
  }
  getColor(): ChessColor {
    return (this.x + this.y) % 2 == 0 ? ChessColor.white : ChessColor.black;
  }
  static fromString(sCoord: string): CellCoord {
    if (sCoord.length !== 2) {
      throw new Error('Error in CellCoord.fromString(sCoord): incorrect cell coordinate');
    } else {
      let xCoord = sCoord.charCodeAt(0) - 'a'.charCodeAt(0);
      let yCoord = 8 - 1 - (sCoord.charCodeAt(1) - '1'.charCodeAt(0));
      return new CellCoord(xCoord, yCoord);
    }
  }
  equal(cell: ICellCoord): boolean {
    return (this.x === cell.x && this.y === cell.y);
  }
}
