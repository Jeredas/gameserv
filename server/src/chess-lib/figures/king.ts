import { CastlingMove } from '../castling-move';
import { CellCoord } from '../cell-coord';
import { ChessColor } from '../chess-color';
import { COMMON } from '../common';
import { Figure } from '../figure';
import { FigureType } from '../figure-type';
import { IField } from '../ifield';
import { Move } from '../move';
import { Moves } from '../moves';
import { CastlingType } from '../castling-type';

export class King extends Figure {
  static CASTLING_TYPES: Array<CastlingType> = ['K', 'Q', 'k', 'q'];
  constructor(color: ChessColor) {
    super(FigureType.king, color);
  }
  getMoves(position: CellCoord, field: IField, checkDanger: boolean = true): Moves {
    const result = new Moves();
    if (!field.isFreeCell(position) && field.getFigure(position).toString() == this.toString() && field.playerColor == this.color) { 
      for (let vector of COMMON.DIAGONAL_MOVES) {
        let resultPosition = vector.resultPosition(position);
        if (resultPosition.isCorrect() && (field.isFreeCell(resultPosition) || field.getFigure(resultPosition)?.color !== this.color)) {
          const move = new Move(position, vector);
          if (!checkDanger || !this.isDangerousMove(move, field)) result.add(move);
        }
      }
      for (let vector of COMMON.HV_MOVES) {
        let resultPosition = vector.resultPosition(position);
        if (resultPosition.isCorrect() && (field.isFreeCell(resultPosition) || field.getFigure(resultPosition)?.color !== this.color)) {
          const move = new Move(position, vector);
          if (!checkDanger || !this.isDangerousMove(move, field)) result.add(move);
        }
      }
      King.CASTLING_TYPES.forEach((castlingType) => {
        const castlingMove = new CastlingMove(castlingType)
        if (castlingMove.isValid(field, checkDanger)) {
          result.add(castlingMove);
        }
      })
    }
    return result;
  }
}