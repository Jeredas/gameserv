import { CellCoord } from './cell-coord';
import { ChessColor } from './chess-color';
import { Field } from './field';
import { IChessProcessor } from './ichess-processor';
import { IField } from './ifield';
import { Move } from './move';
import { Moves } from './moves';
import { Vector } from './vector';
import { HistoryItems } from './history-items';
import { IHistoryItem } from './ihistory-item';
import { King } from './figures/king';
import { ICellCoord } from './icell-coord';
import { IChessAI } from './ichessai'
import { ChessAI } from './chessai'
import { IMove } from './imove';

export class ChessProcessor implements IChessProcessor {
  private field: IField;
  private chessAI: IChessAI;
  private historyItems: HistoryItems;
  constructor() {
    this.field = Field.getStartField();
    this.chessAI = new ChessAI();
    this.historyItems = new HistoryItems();
  }
  clearData(): void {
    this.field = Field.getStartField();
    this.historyItems = new HistoryItems();
  }
  getField(): string {
    return this.field.toFEN();
  }
  makeMove(start_coord: ICellCoord, end_coord: ICellCoord): boolean {
    // const move = new Move(start_coord, new Vector(end_coord.x - start_coord.x, end_coord.y - start_coord.y));
    const moves = Array.from(this.field.getAllowedMoves(start_coord)).filter(move => move.getTargetCell().equal(end_coord));
    let move: IMove;
    if (moves.length > 0) {
      move = moves[0];
    }
    if (move && move.isValid(this.field)) {
      this.historyItems.addItem(move, this.field);
      this.field = move.makeMove(this.field);
      return true;
    } else {
      return false;
    }
  }
  getHistory(): Array<IHistoryItem> {
    return this.historyItems.getHistory();
  }
  getMoves(coord: ICellCoord): Moves {
    return this.field.getAllowedMoves(coord);
  }
  getKingPos(): ICellCoord {
    return this.field.getKingCoord();
  }
  startGame(fen?: string): void {
    if (fen) {
      this.field = Field.fromFEN(fen)
    }
    this.historyItems.startHistory();
  }
  getStartTime(): number {
    return this.historyItems.getStartTime();
  }
  getPlayerColor(): ChessColor {
    return this.field.playerColor;
  }
  getFigureStr(coord: ICellCoord): string {
    return this.field.getFigure(coord).toString();
  }
  getKingRivals(): Set<string> {
    return this.field.getKingRivals();
  }
  isMate(): boolean {
    return this.field.isMate();
  }
  isStaleMate(): boolean {
    return this.field.isStaleMate();
  }
  getRecommendMove(): IMove | null {
    return this.chessAI.getRecommendMove(this.field);
  }
}
