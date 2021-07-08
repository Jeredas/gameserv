import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import Cell from './cell';
import CrossButton from './button/cross-button';
import crossStyles from './cross.module.css';
import HistoryBlock from './history/history';
import { IJoinedPlayer } from 'src/components/utilities/interfaces';

const size = 3;
class Timer extends Control {
  private counter = 0;

  private count = 10;

  private time: number;

  private startTime = 0;

  private isPlaying = false;

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', crossStyles.cross_timer);
    this.node.textContent = '00:10';
  }

  start() {
    this.counter = window.setInterval(() => {
      this.time = Math.floor((Date.now() - this.startTime) / 1000);
      this.node.textContent = this.getTimeString();
    }, 1000);
  }

  clear() {
    if (this.counter) {
      window.clearInterval(this.counter);
      this.counter = 0;
      this.node.textContent = '00:00';
      this.startTime += 11000;
    }
  }

  countDown() {
    this.counter = window.setInterval(() => {
      if (this.count - this.time === 0) {
        this.clear();
        this.start();
        this.isPlaying = true;
      } else {
        this.time = Math.floor((Date.now() - this.startTime) / 1000);
        this.node.textContent = this.getCountDownString();
      }
    }, 1000);
  }

  setTimer(startTime: number) {
    this.startTime = startTime;
    this.time = startTime;
    this.countDown();
  }

  getCountDownString(): string {
    const seconds = Math.floor((this.count - this.time) % 60);

    const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `00:${secOutput}`;
  }

  getTimeString(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = Math.floor(this.time % 60);

    const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minOutput}:${secOutput}`;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

class Cross extends Control {
  private cells: Array<Cell> = [];

  public onCellClick: (coords: Vector) => void = () => {};

  timer: Timer;

  history: HistoryBlock;

  private playerOne: Control;

  private playerTwo: Control;

  private players: Array<string> = [];

  private isRotated = false;

  private crossCells: Control;

  private btnStart: CrossButton;

  public onStartClick: () => void = () => {};

  private btnDraw: CrossButton;

  public onDrawClick: () => void = () => {};

  private btnLoss: CrossButton;

  public onLossClick: () => void = () => {};

  private host = '';

  private crossMode = 'network';

  constructor(parentNode: HTMLElement) {
    super(parentNode, 'div', crossStyles.cross_wrapper);
    const crossControls = new Control(this.node, 'div', crossStyles.cross_controls);
    const crossHead = new Control(this.node, 'div', crossStyles.cross_head);
    this.playerOne = new Control(crossHead.node, 'div', crossStyles.cross_player, 'Player1');
    this.timer = new Timer(crossHead.node);
    this.playerTwo = new Control(crossHead.node, 'div', crossStyles.cross_player, 'Player2');
    const crossBody = new Control(this.node, 'div', crossStyles.cross_body);
    this.history = new HistoryBlock(crossBody.node);

    this.crossCells = new Control(crossBody.node, 'div', crossStyles.cross_cells);
    for (let i = 0; i < size; i++) {
      const row = new Control(this.crossCells.node, 'div', crossStyles.cross_row);
      for (let j = 0; j < size; j++) {
        const cell = new Cell(row.node, crossStyles.cross_cell, new Vector(j, i));
        cell.onCellClick = (coords: Vector) => {
          if (this.timer.getIsPlaying()) {
            this.onCellClick(coords);
          }
        };
        this.cells.push(cell);
      }
    }

    this.btnStart = new CrossButton(crossControls.node, 'Start');
    this.btnStart.buttonDisable();

    this.btnStart.onClick = () => {
      this.onStartClick();
    };
    this.btnDraw = new CrossButton(crossControls.node, 'Draw');
    this.btnDraw.buttonDisable();

    this.btnDraw.onClick = () => {
      this.onDrawClick();
    };
    this.btnLoss = new CrossButton(crossControls.node, 'Loss');
    this.btnLoss.buttonDisable();

    this.btnLoss.onClick = () => {
      this.onLossClick();
    };
  }

  updateGameField(field: Array<Array<string>>): void {
    this.cells.forEach((cell) => {
      const { x, y } = cell.getCellCoord();
      if (field[y][x]) {
        cell.clickedCell(field[y][x]);
      }
    });
    // if (!this.isRotated) {
    //   this.crossCells.node.classList.add('rotate');
    // } else {
    //   this.crossCells.node.classList.remove('rotate');
    // }
    // this.isRotated = !this.isRotated;
  }

  clearData() {
    this.cells.forEach((cell) => cell.clearCell());
    this.players = [];
    this.playerOne.node.textContent = 'Player1';
    this.playerTwo.node.textContent = 'Player2';
    this.timer.clear();
  }

  setPlayer(params: IJoinedPlayer): void {
    console.log(params);
    const player1 = params.players[0].login;
    

    this.playerOne.node.textContent = player1;
    this.players.push(player1);

    if (this.crossMode !== 'network') {
      this.host = player1;
      this.btnStart.buttonEnable();
    } else if (params.players[1]) {
      const player2 = params.players[1].login;
      this.playerTwo.node.textContent = player2;
      this.players.push(player2);
      this.host = params.player !== player1 ? player1 : player2;
      this.btnStart.buttonEnable();
    }
  }

  startGame(startTime: number): void {
    this.btnStart.buttonDisable();
    this.btnDraw.buttonEnable();
    this.btnLoss.buttonEnable();
    this.timer.setTimer(startTime);
  }

  setHistoryMove(sign: string, coords: Vector, time: string): void {
    this.history.setHistoryMove(sign, coords, this.timer.getTimeString());
  }
}

export default Cross;
