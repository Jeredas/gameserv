import { CellCoord } from './cell-coord';
import { CellCoords } from './cell-coords';
import { ChessColor } from './chess-color';
import { Figures } from './figures';
import { ICellCoord } from './icell-coord';
import { IFigure } from './ifigure';
import { IPosition } from './iposition';
import { Moves } from './moves';

export interface IField {
  readonly playerColor: ChessColor;
  readonly castlingFlags: number;
  readonly pawnTresspassing: CellCoord | null;
  readonly fiftyRuleCount: number;
  readonly moveNumber: number;
  readonly cost: number;

  copy(): IField;
  getAllCellCoords(): CellCoords;
  getFigure(coord: ICellCoord): IFigure | undefined;
  getFigures(): Figures;
  getFiguresCount(): number;
  getPosition(): IPosition;
  getAllowedMoves(coord: ICellCoord): Moves;
  getAllAllowedMoves(checkDanger?: boolean): Moves;
  isFreeCell(coord: ICellCoord): boolean;
  toFEN(): string;
  getKingCoord(): ICellCoord;
  getAttackedCells(): Set<string>;
  getKingRivals(): Set<string>;
  isCheck(): boolean;
  isMate(): boolean;
  isStaleMate(): boolean;
  // static fromFEN(fen: string): IField;
  // static getStartField(): IField;

  // TODO: Implement next functions
  // getRecommendMoves(): Moves;
  // isMate(): boolean;
}
