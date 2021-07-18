import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import Cell from './cell';
import CrossButton from './button/cross-button';
import crossStyles from './cross.module.css';
import HistoryBlock from './history/history';
import { ICrossStop, IJoinedPlayer, ICrossHistory } from '../../utilities/interfaces';
import Timer from '../../timer/timer';
import ModalDraw from './modal/modal-draw';
import ModalGameOver from './modal/modalGameOver';

const size = 3;

class Cross extends Control {
  private cells: Array<Cell> = [];

  public onCellClick: (coords: Vector) => void = () => {};

  timer: Timer;

  history: HistoryBlock;

  public playerOne: Control;

  public playerTwo: Control;

  private players: Array<string> = [];

  private isRotated = false;

  private crossCells: Control;

  public btnStart: CrossButton;

  public onStartClick: (player: string) => void = () => {};

  public btnDraw: CrossButton;

  public onDrawClick: () => void = () => {};

  public btnLoss: CrossButton;

  public onLossClick: () => void = () => {};

  private host = '';

  private crossMode = 'network';

  private modalPopup: ModalDraw;
  public onModalDrawClick: (response: string) => void = () => {};
  private modalGameOver: ModalGameOver;
  public onGameOverClick: () => void = () => {};

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
      this.onStartClick(this.host);
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
    this.history.clearHistory();
    this.btnStart.buttonDisable();
    this.btnDraw.buttonDisable();
    this.btnLoss.buttonDisable();
  }

  setPlayer(params: IJoinedPlayer): void {
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

  setHistoryMove(params: ICrossHistory): void {
    this.history.setHistoryMove(params);
  }

  createModalDraw(data: ICrossStop): void {
    console.log(data.player, this.host);
    if(data.method === 'disagree') {
      this.createModalGameOver({method: data.method, player: data.player})
    }
    this.modalPopup = new ModalDraw(this.node, data.stop, data.player, this.players, data.method);
    this.modalPopup.onModalDrawClick = (response: string) => {
      this.onModalDrawClick(response);
    };
  }

  createModalGameOver(params: {method: string, player: string}): void {
    this.timer.stop();
    this.modalPopup && this.modalPopup.destroy();
    this.modalGameOver = new ModalGameOver(this.node, params, this.players);
    this.modalGameOver.onGameOverClick = () => {
      this.onGameOverClick();
      this.destroyModalGameOver();
    }
  }

  destroyModalDraw(): void {
    this.modalPopup.destroy();
  }

  destroyModalGameOver(): void {
    this.modalGameOver.destroy();
  }
}

export default Cross;
