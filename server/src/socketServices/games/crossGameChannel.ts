import { ChatChannel } from '../socketChannel';
import Vector from '../../utils/vector';


export class CrossGameChannel extends ChatChannel{
  logic: CrossGameLogic;
  constructor(name:string, type: string, params:any){
    super(name, type);
    console.log('created OnlyChatChannel');
    this.logic = new CrossGameLogic()
  }
}


let size = 3;
export class CrossGameLogic {
  private field: Array<Array<string>> = [];
  private players: Array<string> = [];
  private currentPlayerIndex: number = 0;
  private signs: Array<string> = [ 'X', 'O' ];
  private winner: string = '';
  private currentSign: string = this.signs[0];

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
      if (!this.winner) {
        if (player === this.players[this.currentPlayerIndex]) {
          this.field[coords.y][coords.x] = this.signs[this.currentPlayerIndex];
          this.checkWinner(coords, this.signs[this.currentPlayerIndex]);
          this.currentSign = this.signs[this.currentPlayerIndex];
          this.setCurrentPlayer();
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
  }

  getCurrentSign(): string {
    return this.currentSign;
  }

  getCurrentPlayer(): string {
    return this.players[this.currentPlayerIndex];
  }
}
