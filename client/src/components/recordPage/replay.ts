import {
  IChessHistory,
  ICrossHistory,
  IPublicUserInfo,
  IChessData
} from '../utilities/interfaces';
import Control from '../utilities/control';
import GenericPopup from '../genericPopup/genericPopup';
import ButtonDefault from '../buttonDefault/buttonDefault';
import recordStyles from './recordPage.module.css';
import InputWrapper from '../inputWrapper/inputWrapper';
import Cross from '../games/cross/cross';
import ChessGame, { fromFen } from '../games/chess/chess-game';
import { IGameRecord } from './recordPage';
export class Replay extends GenericPopup<string> {
  history: Array<IChessHistory> | Array<ICrossHistory>;
  replaySrceen: Control;
  popupWrapper: Control;
  gameType: string;
  params: IGameRecord;
  startButton: ButtonDefault;
  closeBtn: ButtonDefault;
  speed: number;
  speedSelection: InputWrapper;
  view: Cross;
  chessView: ChessGame;
  speedTimer: NodeJS.Timeout;

  constructor(parentNode: HTMLElement, params: IGameRecord) {
    super(parentNode);
    this.popupWrapper.node.classList.add(recordStyles.replay_wrapper);
    this.params = params;
    this.speed = 1;
    this.startButton = new ButtonDefault(
      this.popupWrapper.node,
      recordStyles.record_button,
      'replay'
    );
    this.speedSelection = new InputWrapper(
      this.popupWrapper.node,
      'Enter replay speed value',
      () => null,
      'Value from 1 to 10',
      'number',
      'number'
    );
    (this.speedSelection.field.node as HTMLInputElement).pattern = '^d+$';
    this.speedSelection.field.node.oninput = () => {
      this.speed = Number(this.speedSelection.getValue());
    };
    this.startButton.onClick = () => {
      this.start();
    };
    this.replaySrceen = new Control(
      this.popupWrapper.node,
      'div',
      recordStyles.record_replayScreen
    );
    // this.replaySrceen.node.style.width = '500px';
    // this.replaySrceen.node.style.height = '500px';
    this.closeBtn = new ButtonDefault(this.popupWrapper.node, recordStyles.record_closeButton, '');
    this.closeBtn.onClick = () => {
      this.onSelect('close');
    };
  }
  async start() {
    this.replaySrceen.node.innerHTML = '';
    if (this.params.gameType == 'CROSS') {
      this.view = new Cross(this.replaySrceen.node);
      this.view.playerOne.node.textContent = this.params.player1.login;
      this.view.playerTwo.node.textContent = this.params.player2.login;
      this.view.btnStart.destroy();
      this.view.btnDraw.destroy();
      this.view.btnLoss.destroy();
      (this.params.history as Array<ICrossHistory>).forEach((res: ICrossHistory, i: number) => {
        setTimeout(() => {
          // const move = new Control( this.replaySrceen.node, 'div', );
          // move.node.textContent = `${res.sign}-${res.move.x}-${res.move.y}-${res.time}`;
          this.view.setHistoryMove(res)
          this.view.timer.node.innerHTML = `${res.time}`;
          const field: Array<Array<string>> = [[], [], []];
          field[res.move.y][res.move.x] = res.sign;
          this.view.updateGameField(field);
        }, 1000 / this.speed * ++i);
      });
    }
    if (this.params.gameType == 'CHESS') {
      const startTime = Date.now();
      const players = [
        {
          login: this.params.player1.login,
          avatar: ''
        },
        {
          login: this.params.player2.login,
          avatar: ''
        }
      ];
      this.chessView = new ChessGame(this.replaySrceen.node, this.params.gameMode);
      this.chessView.hideButtons();
      this.chessView.setHistoryFontColor();
      this.chessView.setPlayer({ player: this.params.player1.login, players: players });
      this.chessView.setPlayer({ player: this.params.player2.login, players: players });
      this.chessView.startGame({
        field: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
        time: startTime
      });
      this.chessView.setSpeed(this.speed);
      // if (this.speed > 1) {
      //   this.chessView.stopTimer();
      //   this.chessView.timerReplace();
      //   let time = 1;
      //   this.speedTimer = setInterval(() => {
      //     this.chessView.timer.node.textContent = `${getTimeString(time)}`;
      //     time += 1
      //   }, 1000 / this.speed)
      // }
      const moves = this.params.moves;
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        const deltaTime = move.history.time - (i > 0 ? moves[i - 1].history.time : 0);
        await this.replayMove(move, i, deltaTime);
      };
      let delayWinner = 500;
      delay(delayWinner / this.speed).then(() => {
        if (this.params.winner.toLocaleLowerCase() == 'draw' || this.params.winner.toLocaleLowerCase() == 'stalemate') {
          const winnerAlert = new Control(this.replaySrceen.node, 'div', recordStyles.record_winnerPop);
          winnerAlert.node.textContent = this.params.winner.toLocaleUpperCase();
        } else {
          const winnerAlert = new Control(this.replaySrceen.node, 'div', recordStyles.record_winnerPop);
          winnerAlert.node.textContent = `Winner is ${this.params.winner}`;
        }
        this.chessView.clearData()
        this.chessView.stopTimer();
        clearInterval(this.speedTimer);
      })
    }
  }

  private replayMove(move: { field: string; player: string; history: IChessHistory; }, i: number, deltaTime: number) {
    return delay(deltaTime / this.speed).then(() => {
      const chessDataMove: IChessData = {
        coords: move.history.coords,
        player: move.player,
        field: move.field,
        winner: '',
        rotate: false,
        history: move.history,
        king: {
          check: null,
          mate: false,
          staleMate: false
        }
      };
      this.chessView.onFigureMove(chessDataMove);
    });
  }
}

function getTimeString(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const minOutput = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secOutput = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minOutput}:${secOutput}`;
}

function delay(time: number): Promise<void> {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(null)
    }, time)
  })
}