import { ChessColor } from "./chess-color"
import { ICellCoord } from "./icell-coord"
import { IVector } from "./ivector"

export interface ICastlingData {
  kingStart: ICellCoord,
  kingVector: IVector,
  rookStart: ICellCoord,
  rookVector: IVector,
  freeCells: Array<ICellCoord>,
  notCheckCells: Array<IVector>,
  notation: string,
  color: ChessColor,
  flag: number
}