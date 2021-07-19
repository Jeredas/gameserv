import { IKingInfo } from './../../utilities/interfaces';
import { IChessHistory } from './../../utilities/interfaces';
import Control from '../../utilities/control';
import Timer from '../../timer/timer';
import configFigures, { chessModeConfig, fen } from './config-chess';
import Vector from '../../utilities/vector';

import ChessCell from './chess-cell';
import ChessButton from './chess-button';
import ChessHistoryBlock from './chess-history';
import ChessField from './chess-field';
import ModalDraw from './modal/modal-draw';
import ChessModel from './chess-model';
import chessStyles from './chess-game.module.css';
import { IChessData, IChessStart, IChessStop, IJoinedPlayer } from '../../utilities/interfaces';
import ModalGameOver from './modal/modalGameOver';

class ChessGame extends Control {
  private cells: Array<ChessCell> = [];

  public onCellClick: (coords: Vector) => void = () => {};

  timer: Timer;

  private history: ChessHistoryBlock;

  private playerOne: Control;

  private playerTwo: Control;

  private players: Array<string> = [];

  private isRotated = false;

  private chessBoard: ChessField;

  private btnStart: ChessButton;

  public onStartClick: (player: string) => void = () => {};

  private btnDraw: ChessButton;

  public onDrawClick: (method: string) => void = () => {};

  private btnLoss: ChessButton;

  public onLossClick: (method: string) => void = () => {};

  public onFigureDrop: (posStart: Vector, posDrop: Vector) => void = () => {};

  public onFigureGrab: (pos: Vector) => void = () => {};

  private modalDraw: ModalDraw;

  public onModalDrawClick: (response: string) => void = () => {};

  public onModalLossClick: () => void = () => {};

  private model: ChessModel;

  private host = '';

  private chessMode = '';

  private chessBody: Control;

  private modalPopup: ModalDraw;
  private modalGameOver: ModalGameOver;
  public onGameOverClick: () => void = () => {};
  private field: string;
  private singleModePlayerIndex: number = 0;
  private chessControls: Control;
  private chessHead: Control;

  constructor(parentNode: HTMLElement, chessMode: string) {
    super(parentNode, 'div', chessStyles.chess_wrapper);
    this.chessMode = chessMode;
    this.chessControls = new Control(this.node, 'div', chessStyles.chess_controls);
    const chessHead = new Control(this.node, 'div', chessStyles.chess_head);
    this.playerOne = new Control(chessHead.node, 'div', chessStyles.chess_player, 'Player1');
    this.playerOne.node.classList.add(chessStyles.player_left_active);
    this.field = fen;

    this.timer = new Timer(chessHead.node);

    this.playerTwo = new Control(chessHead.node, 'div', chessStyles.chess_player, 'Player2');
    this.chessBody = new Control(this.node, 'div', chessStyles.chess_body);
    const nodeHeight = this.node.getBoundingClientRect().height;

    this.history = new ChessHistoryBlock(this.chessBody.node);

    this.chessBoard = new ChessField(this.chessBody.node, configFigures, nodeHeight);
    this.initBoard();

    this.btnStart = new ChessButton(this.chessControls.node, 'Start');
    this.btnStart.buttonDisable();
    this.btnStart.onClick = () => {
      this.onStartClick(this.host);
      this.btnStart.buttonDisable();
    };
    this.btnDraw = new ChessButton(this.chessControls.node, 'Draw');
    this.btnDraw.buttonDisable();
    this.btnDraw.onClick = () => {
      this.onDrawClick('draw');
    };
    this.btnLoss = new ChessButton(this.chessControls.node, 'Loss');
    this.btnLoss.buttonDisable();
    this.btnLoss.onClick = () => {
      this.onLossClick('loss');
    };

    this.chessBoard.onFigureDrop = (posStart: Vector, posDrop: Vector) => {
      this.onFigureDrop(posStart, posDrop);
    };

    this.chessBoard.onFigureGrab = (pos: Vector) => {
      this.onFigureGrab(pos);
    };

    window.onresize = () => {
      this.resizeView();
    };
  }

  resizeView() {
    const nodeHeight = this.node.getBoundingClientRect().height;
    this.chessBody.node.style.width = `${nodeHeight}px`;
    this.chessBody.node.style.height = `${nodeHeight - 140}px`;
    this.chessBoard.node.style.height = `${nodeHeight - 140}px`;
    this.chessBoard.node.style.width = `${nodeHeight - 140}px`;
    this.history.node.style.height = `${nodeHeight - 140}px`;
  }

  updateGameField(rotate: boolean): void {
    if (this.chessMode === chessModeConfig.oneScreen) {
      if (rotate) {
        if (!this.isRotated) {
          this.chessBoard.node.classList.add(chessStyles.rotate);
        } else {
          this.chessBoard.node.classList.remove(chessStyles.rotate);
        }
        this.isRotated = !this.isRotated;
      }
    }
  }

  clearData() {
    this.players = [];
    this.playerOne.node.textContent = 'Player1';
    this.playerTwo.node.textContent = 'Player2';
    this.playerOne.node.classList.add(chessStyles.player_left_active);
    this.playerTwo.node.classList.remove(chessStyles.player_right_active);
    this.timer.clear();
    this.history.clearHistory();
    this.removeAllowedMoves();
    this.removeRivalMoves();
    this.chessBoard.removeKingCheck();
    this.chessBoard.removeMateMoves();
    this.chessBoard.clearData(fromFen(fen));
    this.singleModePlayerIndex = 0;
    this.chessBoard.setDragable(false);
    this.btnStart.buttonDisable();
    this.btnDraw.buttonDisable();
    this.btnLoss.buttonDisable();
    this.isRotated = false;
  }

  setPlayer(params: IJoinedPlayer): void {
    const player1 = params.players[0].login;
    this.playerOne.node.textContent = player1;
    this.players.push(player1);
    if (this.chessMode !== chessModeConfig.network) {
      this.singleModePlayerIndex = 0;
      const player2 = params.players[1].login;
      this.playerTwo.node.textContent = player2;
      this.players.push(player2);
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

  setHistoryMove(params: IChessHistory): void {
    this.history.setHistoryMove(params);
  }

  createModalDraw(data: IChessStop): void {
    if (data.method === 'disagree') {
      this.createModalGameOver({ method: data.method, player: data.player });
    }
    this.modalPopup = new ModalDraw(this.node, data.stop, data.player, this.players, data.method);
    this.modalPopup.onModalDrawClick = (response: string) => {
      this.onModalDrawClick(response);
    };
  }

  destroyModalDraw(): void {
    this.modalDraw.destroy();
  }

  setFigurePosition(oldFigPos: Vector, newFigPos: Vector): void {
    this.chessBoard.setFigurePosition(oldFigPos, newFigPos);
  }

  showAllowedMoves(coords: Array<Vector>): void {
    this.chessBoard.showAllowedMoves(coords);
  }

  showKingMate(kingInfo: IKingInfo): void {
    this.chessBoard.showKingMate(kingInfo);
  }

  removeAllowedMoves(): void {
    this.chessBoard.removeAllowedMoves();
  }

  removeRivalMoves(): void {
    this.chessBoard.removeRivalMoves();
  }

  showRecommendedMoves(coords: Array<Vector>): void {
    this.chessBoard.showRecommendedMoves(coords);
  }

  removeRecommendedMoves(): void {
    this.chessBoard.removeRecommendedMoves();
  }

  onFigureMove(data: IChessData): void {
    if (this.field !== data.field) {
      this.host = this.players.find((player) => data.player !== player);
      if (this.chessMode === chessModeConfig.network) {
        if (this.playerOne.node.textContent !== data.player) {
          this.playerOne.node.classList.add(chessStyles.player_left_active);
          this.playerTwo.node.classList.remove(chessStyles.player_right_active);
        } else {
          this.playerOne.node.classList.remove(chessStyles.player_left_active);
          this.playerTwo.node.classList.add(chessStyles.player_right_active);
        }
      } else {
        if (this.singleModePlayerIndex === 0) {
          this.playerOne.node.classList.remove(chessStyles.player_left_active);
          this.playerTwo.node.classList.add(chessStyles.player_right_active);
        } else if (this.singleModePlayerIndex === 1) {
          this.playerOne.node.classList.add(chessStyles.player_left_active);
          this.playerTwo.node.classList.remove(chessStyles.player_right_active);
        }
        this.singleModePlayerIndex = this.singleModePlayerIndex === 1 ? 0 : 1;
      }
      this.field = data.field;
      this.updateGameField(true);
    }

    const newField = fromFen(data.field);

    this.setHistoryMove(data.history);

    const oldFigPos = new Vector(data.coords[0].x, data.coords[0].y);
    const newFigPos = new Vector(data.coords[1].x, data.coords[1].y);

    this.setFigurePosition(oldFigPos, newFigPos);
    this.chessBoard.clearData(newField);

    
    this.removeAllowedMoves();
    this.removeRivalMoves();
    this.chessBoard.removeKingCheck();
    this.removeRecommendedMoves();

    if (data.king.check) {
      const kingInfo = data.king.check;
      this.chessBoard.showKingCheck(kingInfo);
    }
  }

  startGame(data: IChessStart) {
    this.field = data.field;
    this.chessBoard.setChessMode(this.chessMode);
    this.chessBoard.clearData(fromFen(data.field));
    // this.chessBoard.createFieldCells(fromFen(data.field));
    this.chessBoard.setDragable(true);
    this.timer.setTimer(data.time);
    this.btnDraw.buttonEnable();
    this.btnLoss.buttonEnable();
    this.btnStart.buttonDisable();
  }

  getPlayers(): Array<string> {
    return this.players;
  }

  createModalGameOver(params: { method: string; player: string }): void {
    this.timer.stop();
    this.modalPopup && this.modalPopup.destroy();
    this.modalGameOver = new ModalGameOver(this.node, params, this.players);
    this.modalGameOver.onGameOverClick = () => {
      this.onGameOverClick();
      this.destroyModalGameOver();
    };
  }

  destroyModalGameOver(): void {
    this.modalGameOver.destroy();
  }

  initBoard(): void {
    this.chessBoard.createFieldCells(fromFen(fen));
  }

  chessBoardClear(fen: string): void {
    this.chessBoard.clearData(fromFen(fen));
  }

  stopTimer(): void {
    this.timer.stop();
  }

  hideButtons(): void {
    this.chessControls.node.style.display = 'none';
  }

  setHistoryFontColor(): void {
    this.history.setHistoryFontColor();
  }

  // timerReplace(): void {
  //   (this.timer as Control).node.textContent = '';
  // }
  setSpeed(speed:number){
    this.timer.setSpeed(speed)
  }

  // timerShowReplay(time: string) {
  //   (this.timer as Control).node.textContent = time;
  // }
}

export default ChessGame;

export function fromFen(fen: string): Array<string> {
  const fromFen: Array<string> = [];
  fen.split('/').join('').split('').forEach((el) => {
    if (!Number.isNaN(+el)) {
      for (let i = 0; i < +el; i++) {
        fromFen.push('-');
      }
    } else fromFen.push(el);
  });
  return fromFen.join('').split('').map((item) => (item === '-' ? '' : item));
}

export function kingInfoToVector(
  coordsKing: { x: number; y: number },
  cells: Array<{ x: number; y: number }>
) {
  return {
    coords: new Vector(coordsKing.x, coordsKing.y),
    rival: cells.map((cell) => new Vector(cell.x, cell.y))
  };
}
