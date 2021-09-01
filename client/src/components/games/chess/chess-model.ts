import { IChessHistory } from './../../utilities/interfaces';
import Vector from '../../utilities/vector';
import { IChessData, IChessStart, IChessStop } from '../../utilities/interfaces';
import Signal from '../../../socketClient/signal';
import appStorage from '../../../components/utilities/storage';

class ChessModel {
  onChessMove: Signal<IChessData> = new Signal();

  socket: WebSocket;

  onStartGame: Signal<IChessStart> = new Signal();

  onStopGame: Signal<IChessStop> = new Signal();

  onRemoveGame: Signal<boolean> = new Signal();

  onChessFigureGrab: Signal<Array<Vector>> = new Signal();

  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  processMessage(data: any) {
    if (data.method === 'chessMove') {
      // !!!-----------change to History
      const dataFigure = new Array<string>();
      const dataMoves = [];
      for (let i = 0; i < data.history.length; i++) {
        dataFigure.push(data.history[i].figure);
        const move = [];
        move.push(data.history[i].startCell);
        move.push(data.history[i].endCell);
        dataMoves.push(move);
        // data.time temporaly ignored
      }
      // !!!-----------end change
      this.onChessMove.emit({
        coords: JSON.parse(data.messageText),
        player: data.senderNick,
        field: data.field,
        winner: data.winner,
        rotate: data.rotate,
        history: data.history,
        king: data.king
      });
    }
    if (data.method === 'startGame') {
      this.onStartGame.emit({ field: data.field, time: data.time });
    }

    if (data.method === 'chessFigureGrab') {
      this.onChessFigureGrab.emit(data.moves);
    }
    if (data.method === 'drawAgreeNetwork') {
      this.onStopGame.emit({ stop: data.stop, player: data.player, method: data.method });
    }
    if (data.method === 'drawNetwork') {
      this.onStopGame.emit({ stop: data.stop, player: data.player, method: data.method });
    }
    if (data.method === 'drawSingleGame') {
      this.onStopGame.emit({ stop: data.stop, player: data.player, method: data.method });
    }

    if (data.method === 'removeGame') {
      this.onRemoveGame.emit(data.remove);
    }
  }

  chessMove(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessMove',
        params: {
          messageText: message,
          sessionId: appStorage.getSession()
        }
      })
    );
  }

  chessFigureGrab(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessFigureGrab',
        params: {
          messageText: message,
          sessionId: appStorage.getSession()
        }
      })
    );
  }

  chessStartGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessStartGame',
        params: {
          messageText: message,
          sessionId: appStorage.getSession()
        }
      })
    );
  }

  chessStopGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessStopGame',
        params: {
          messageText: message,
          sessionId: appStorage.getSession()
        }
      })
    );
  }

  chessRemoveGame(message: string) {
    this.socket.send(
      JSON.stringify({
        service: 'chat',
        endpoint: 'chessRemoveGame',
        params: {
          messageText: message,
          sessionId: appStorage.getSession()
        }
      })
    );
  }
}

export default ChessModel;
