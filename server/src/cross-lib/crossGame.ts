import { ICrossHistory } from '../socketServices/games/crossGameChannel/crossGameChannel';
import Vector from '../utils/vector';

let size = 3;
class CrossGameLogic {
  private field: Array<Array<string>> = [];
  private players: Array<string> = [];
  private currentPlayerIndex: number = 0;
  private signs: Array<string> = [ 'X', 'O' ];
  private winner: string = '';
  private currentSign: string = this.signs[0];
  private gameMode: string = 'network';
  private history: Array<ICrossHistory> = [];
  private startTime: number = 0;
  private moveCounter = 0;
  private noMoves = false;

  constructor() {
    this.field = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];
  }
  getPlayers(): Array<string> {
    return this.players;
  }

  setPlayers(player: string): void {
    if (this.players.length < 2) {
      this.players.push(player);
    }
  }

  setCurrentPlayer(): void {
    this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
  }

  writeSignToField(player: string, coords: Vector): void {
    if (this.players.length === 2) {
      if (!this.winner || !this.noMoves) {
        if (player === this.players[this.currentPlayerIndex]) {
          this.field[coords.y][coords.x] = this.signs[this.currentPlayerIndex];
          this.checkWinner(coords, this.signs[this.currentPlayerIndex]);
          this.currentSign = this.signs[this.currentPlayerIndex];
          const time = getTimeString(Math.floor((Date.now() - this.startTime) / 1000));
          this.moveCounter++;
          this.history.push({
            sign: this.currentSign,
            move: coords,
            time: time,
            player
          });
          this.setCurrentPlayer();
          if (this.moveCounter >= 9) {
            this.noMoves = !this.noMoves;
          }
        }
      }
    }
  }

  getField(): Array<Array<string>> {
    return this.field;
  }

  getWinner(): string {
    return this.winner;
  }

  checkWinner(coords: Vector, sign: string): void {
    let countHor = 1;
    let countVer = 1;
    let countDiagPrim = 1;
    let countDiagSec = 1;

    const { x: fromX, y: fromY } = coords;
    const moveHor = [ { x: -1, y: 0 }, { x: 1, y: 0 } ];
    const moveVer = [ { x: 0, y: 1 }, { x: 0, y: -1 } ];
    const moveDiagPrim = [ { x: -1, y: -1 }, { x: 1, y: 1 } ];
    const moveDiagSec = [ { x: -1, y: 1 }, { x: 1, y: -1 } ];

    moveHor.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          if (this.field[toY][toX] === sign) {
            countHor++;
          } else break;
        }
      }
    });

    moveVer.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          if (this.field[toY][toX] === sign) {
            countVer++;
          } else break;
        }
      }
    });

    moveDiagPrim.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          if (this.field[toY][toX] === sign) {
            countDiagPrim++;
          } else break;
        }
      }
    });

    moveDiagSec.forEach((move) => {
      let toX = fromX;
      let toY = fromY;
      for (let i = 0; i < size; i++) {
        toX += move.x;
        toY += move.y;
        if (toY >= 0 && toY < size && toX >= 0 && toX < size) {
          if (this.field[toY][toX] === sign) {
            countDiagSec++;
          } else break;
        }
      }
    });
    if (countHor === size || countVer === size || countDiagPrim === size || countDiagSec === size) {
      this.winner = this.players[this.currentPlayerIndex];
      console.log(`Win! The player ${this.players[this.currentPlayerIndex]} wins the game`);
    }
  }

  clearData(): void {
    this.field = [ [ '', '', '' ], [ '', '', '' ], [ '', '', '' ] ];
    this.players = [];
    this.currentPlayerIndex = 0;
    this.winner = '';
    this.history = [];
    this.startTime = 0;
    this.moveCounter = 0;
    this.noMoves = false;
  }

  getCurrentSign(): string {
    return this.currentSign;
  }

  getCurrentPlayer(): string {
    return this.players[this.currentPlayerIndex];
  }

  getGameMode(): string {
    return this.gameMode;
  }

  getHistory(): ICrossHistory {
    return this.history[this.history.length - 1];
  }

  startGame(time: number): void {
    this.startTime = time;
  }

  getFullHistory(): Array<ICrossHistory> {
    return this.history;
  }

  getNoMove(): boolean {
    return this.noMoves;
  }
}

function getTimeString(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minOutput}:${secOutput}`;
}


export default CrossGameLogic;
