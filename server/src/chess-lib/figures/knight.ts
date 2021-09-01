import { CellCoord } from '../cell-coord';
import { ChessColor } from '../chess-color';
import { COMMON } from '../common';
import { Figure } from '../figure';
import { FigureType } from '../figure-type';
import { IField } from '../ifield';
import { Move } from '../move';
import { Moves } from '../moves';

export class Knight extends Figure {
  constructor(color: ChessColor) {
    super(FigureType.knight, color);
  }
  getMoves(position: CellCoord, field: IField, checkDanger: boolean = true): Moves {
    const result = new Moves();
    if (!field.isFreeCell(position) && field.getFigure(position).toString() == this.toString() && field.playerColor == this.color) {
      for (let vector of COMMON.KNIGHT_MOVES) {
        const resultPosition = vector.resultPosition(position);
        if (resultPosition.isCorrect() && (field.isFreeCell(resultPosition) || field.getFigure(resultPosition)?.color !== this.color)) {
          const move = new Move(position, vector);
          if (!checkDanger || !this.isDangerousMove(move, field)) result.add(move);
        }
      }
    }
    return result;
  }
}
