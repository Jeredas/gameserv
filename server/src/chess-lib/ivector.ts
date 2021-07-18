import { CellCoord } from './cell-coord';

export interface IVector {
  readonly x: number;
  readonly y: number;
  sum(v: IVector): IVector;
  copy(): IVector;
  equal(other: IVector): boolean;
  resultPosition(start: CellCoord): CellCoord;
}
