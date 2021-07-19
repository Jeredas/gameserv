import { FigureType } from './figure-type';
import { Vector } from './vector';
import { IFigure } from './ifigure';
import { ChessColor } from './chess-color';
import { Queen } from './figures/queen';
import { Rook } from './figures/rook';
import { Bishop } from './figures/bishop';
import { Knight } from './figures/knight';
import { King } from './figures/king';
import { Pawn } from './figures/pawn';
import { ICastlingData } from './icastling-data';
import { CastlingMove } from './castling-move';
import { CellCoord } from './cell-coord';
import { CastlingType } from './castling-type';

export enum LOCALES {
  RU,
  EN,
}

export class COMMON {
  static NOVEMDECIMAL_BASE = 19;
  static BOARD_SIZE = 8;
  static DEFAULT_LOCALE = LOCALES.EN;
  static START_POSITION_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  // static START_POSITION_FEN = '7B/Q7/8/p1Pk3p/P2P3P/4R2N/1P3PP1/3RKB2 w - - 8 41';
  // static START_POSITION_FEN = 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1';

  static SHORT_WHITE_CASTLING = 1;
  static LONG_WHITE_CASTLING = 2;
  static SHORT_BLACK_CASTLING = 4;
  static LONG_BLACK_CASTLING = 8;
  static ALL_CASTLING = 15;
  
  static CASTLING_DATA = new Map<CastlingType, ICastlingData>([
    ['K', {
      kingVector: new Vector(2, 0),
      rookVector: new Vector(-2, 0),
      rookStart: new CellCoord(7,7),
      kingStart: new CellCoord(4, 7),
      freeCells: [new CellCoord(5, 7), new CellCoord(6, 7)],
      notCheckCells: [new Vector(1, 0), new Vector(2, 0)],
      notation: 'O-O',
      color: ChessColor.white,
      flag: COMMON.SHORT_WHITE_CASTLING
    }],
    ['Q', {
      kingStart: new CellCoord(4, 7),
      kingVector: new Vector(-2, 0),
      rookStart: new CellCoord(0,7),
      rookVector: new Vector(3, 0),
      freeCells: [new CellCoord(3, 7), new CellCoord(2, 7), new CellCoord(1, 7)],
      notCheckCells: [new Vector(-1, 0), new Vector(-2, 0)],
      notation: 'O-O-O',
      color: ChessColor.white,
      flag: COMMON.LONG_WHITE_CASTLING
    }],
    ['k', {
      kingStart: new CellCoord(4, 0),
      kingVector: new Vector(2, 0),
      rookStart: new CellCoord(7,0),
      rookVector: new Vector(-2, 0),
      freeCells: [new CellCoord(5, 0), new CellCoord(6, 0)],
      notCheckCells: [new Vector(1, 0), new Vector(2, 0)],
      notation: 'o-o',
      color: ChessColor.black,
      flag: COMMON.SHORT_BLACK_CASTLING
    }],
    ['q', {
      kingStart: new CellCoord(4, 0),
      kingVector: new Vector(-2, 0),
      rookStart: new CellCoord(0, 0),
      rookVector: new Vector(3, 0),
      freeCells: [new CellCoord(3, 0), new CellCoord(2, 0), new CellCoord(1, 0)],
      notCheckCells: [new Vector(-1, 0), new Vector(-2, 0)],
      notation: 'o-o-o',
      color: ChessColor.black,
      flag: COMMON.LONG_BLACK_CASTLING
    }]
  ]);
  static FIGURE_SHORT_NAMES = new Map([
    // TODO: переписать красиво, чтобы удобно было обращаться к элементам
    [
      LOCALES.EN,
      new Map([
        [FigureType.king, 'K'],
        [FigureType.queen, 'Q'],
        [FigureType.rook, 'R'],
        [FigureType.bishop, 'B'],
        [FigureType.knight, 'N'],
        [FigureType.pawn, 'P'],
      ]),
    ],
    [
      LOCALES.RU,
      new Map([
        [FigureType.king, 'Кр'],
        [FigureType.queen, 'Ф'],
        [FigureType.rook, 'Л'],
        [FigureType.bishop, 'С'],
        [FigureType.knight, 'К'],
        [FigureType.pawn, 'П'],
      ]),
    ],
  ]);
  static FIGURE_FROM_CHAR = new Map<string, IFigure>([
    ['k', new King(ChessColor.black)],
    ['K', new King(ChessColor.white)],
    ['p', new Pawn(ChessColor.black)],
    ['P', new Pawn(ChessColor.white)],
    ['q', new Queen(ChessColor.black)],
    ['Q', new Queen(ChessColor.white)],
    ['r', new Rook(ChessColor.black)],
    ['R', new Rook(ChessColor.white)],
    ['b', new Bishop(ChessColor.black)],
    ['B', new Bishop(ChessColor.white)],
    ['n', new Knight(ChessColor.black)],
    ['N', new Knight(ChessColor.white)],
  ]);
  static FIGURE_COST = new Map([
    [FigureType.king, 900],
    [FigureType.queen, 90],
    [FigureType.rook, 50],
    [FigureType.bishop, 30],
    [FigureType.knight, 30],
    [FigureType.pawn, 10],
  ]);
  static DIAGONAL_MOVES = [new Vector(-1, -1), new Vector(-1, 1), new Vector(1, -1), new Vector(1, 1)];
  static HV_MOVES = [new Vector(-1, 0), new Vector(1, 0), new Vector(0, -1), new Vector(0, 1)];
  static UP_MOVES = [new Vector(0, -1)];
  static DOWN_MOVES = [new Vector(0, 1)];
  static UP_DIAG_MOVES = [new Vector(-1, -1), new Vector(1, -1)];
  static DOWN_DIAG_MOVES = [new Vector(-1, 1), new Vector(1, 1)];
  static KNIGHT_MOVES = [new Vector(-2, -1), new Vector(-1, -2), new Vector(1, -2), new Vector(2, -1), new Vector(2, 1), new Vector(1, 2), new Vector(-1, 2), new Vector(-2, 1)];

  constructor() {}
}
