import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import Cell from './cell';
import CrossButton from './cross-button';
import crossStyles from './cross.module.css';
import HistoryBlock from '../history/history';

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

  private players = 0;

  private isRotated = false;

  private crossCells: Control;

  private btnStart: CrossButton;

  public onStartClick: () => void = () => {};

  private btnDraw: CrossButton;

  public onDrawClick: () => void = () => {};

  private btnLoss: CrossButton;

  public onLossClick: () => void = () => {};

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

    this.btnStart = new CrossButton(crossControls.node, crossStyles.cross_button, 'Start');
    this.btnStart.onClick = () => {
      this.onStartClick();
    };
    this.btnDraw = new CrossButton(crossControls.node, crossStyles.cross_button, 'Draw');
    this.btnDraw.onClick = () => {
      this.onDrawClick();
    };
    this.btnLoss = new CrossButton(crossControls.node, crossStyles.cross_button, 'Loss');
    this.btnLoss.onClick = () => {
      this.onLossClick();
    };
  }

  updateGameField(field: Array<string>): void {
    this.cells.forEach((cell) => {
      const { x, y } = cell.getCellCoord();
      if (field[y][x]) {
        cell.clickedCell(field[y][x]);
      }
    });
    if (!this.isRotated) {
      this.crossCells.node.classList.add('rotate');
    } else {
      this.crossCells.node.classList.remove('rotate');
    }
    this.isRotated = !this.isRotated;
  }

  clearData() {
    this.cells.forEach((cell) => cell.clearCell());
    this.players = 0;
    this.playerOne.node.textContent = 'Player1';
    this.playerTwo.node.textContent = 'Player2';
    this.timer.clear();
  }

  setPlayer(player: string, time: number): void {
    console.log(time);

    if (!this.players) {
      this.playerOne.node.textContent = player;
      this.players++;
    } else if (this.players === 1) {
      this.playerTwo.node.textContent = player;
      this.players++;
      this.timer.setTimer(time);
    }
  }

  setHistoryMove(sign: string, coords: Vector, time: string): void {
    this.history.setHistoryMove(sign, coords, this.timer.getTimeString());
  }
}

export default Cross;
