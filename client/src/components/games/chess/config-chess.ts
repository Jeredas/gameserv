import blackRook from '../../../assets/figures/blackRook.svg';
import blackBishop from '../../../assets/figures/blackBishop.svg';
import blackKnight from '../../../assets/figures/blackKnight.svg';
import blackKing from '../../../assets/figures/blackKing.svg';
import blackQueen from '../../../assets/figures/blackQueen.svg';
import blackPawn from '../../../assets/figures/blackPawn.svg';
import whiteRook from '../../../assets/figures/whiteRook.svg';
import whiteBishop from '../../../assets/figures/whiteBishop.svg';
import whiteKnight from '../../../assets/figures/whiteKnight.svg';
import whiteKing from '../../../assets/figures/whiteKing.svg';
import whiteQueen from '../../../assets/figures/whiteQueen.svg';
import whitePawn from '../../../assets/figures/whitePawn.svg';

// export const configFigures = {
//   r: blackRook,
//   n: blackKnight,
//   b: blackBishop,
//   q: blackQueen,
//   k: blackKing,
//   p: blackPawn,
//   R: whiteRook,
//   N: whiteKnight,
//   B: whiteBishop,
//   Q: whiteQueen,
//   K: whiteKing,
//   P: whitePawn
// };

const configFigures = new Map<string, string>([
  [ 'r', blackRook ],
  [ 'n', blackKnight ],
  [ 'b', blackBishop ],
  [ 'b', blackBishop ],
  [ 'q', blackQueen ],
  [ 'k', blackKing ],
  [ 'p', blackPawn ],
  [ 'R', whiteRook ],
  [ 'N', whiteKnight ],
  [ 'B', whiteBishop ],
  [ 'Q', whiteQueen ],
  [ 'K', whiteKing ],
  [ 'P', whitePawn ]
]);

export const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

export const boardCoordsX = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ];
export const boardCoordsY = [ '8', '7', '6', '5', '4', '3', '2', '1' ];

export const chessModeConfig = {
  network: 'network',
  oneScreen: 'oneScreen',
  bot: 'bot'
};

export default configFigures;
