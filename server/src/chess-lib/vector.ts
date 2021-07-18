import { CellCoord } from './cell-coord';
import { IVector } from './ivector';

export class Vector implements IVector {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  copy(): IVector {
    return new Vector(this.x, this.y);
  }
  sum(vector: IVector): IVector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  equal(other: IVector): boolean{
    return (this.x === other.x && this.y === other.y);
  }
  resultPosition(startCell: CellCoord): CellCoord {
    return new CellCoord(startCell.x + this.x, startCell.y + this.y);
  }
}
