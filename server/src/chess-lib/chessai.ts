import { IChessAI } from "./ichessai";
import { IField } from "./ifield";
import { IMove } from "./imove";

export class ChessAI implements IChessAI {
  getRecommendMove(field: IField, method?: string): IMove | null {
    return this.random(field);
  }
  random(field: IField): IMove | null {
    const moves = Array.from(field.getAllAllowedMoves());
    if (moves.length == 0) {
      return null;
    } else {
      const index = Math.floor(Math.random() * moves.length)
      return moves[index];
    }
  }
}