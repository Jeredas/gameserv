import Control from '../../utilities/control';
import Vector from '../../utilities/vector';
import Figure from './chess-figure';
import ChessCell from './chess-cell';
import chessStyles from './chess-game.module.css';
import { chessModeConfig } from './config-chess';
import { IKingInfo } from '../../../components/utilities/interfaces';

class ChessField extends Control {
  private dragableItems: Control;

  private dragableField: Control = null;

  private figure: Figure;

  private items: Array<Figure> = [];

  onCellDrop: (item: Control, coords: Vector) => void = () => {};

  private startChildPos: Vector;

  public onFigureDrop: (posStart: Vector, posDrop: Vector) => void = () => {};

  private startCellPos: Vector;

  public onFigureGrab: (pos: Vector) => void = () => {};

  private isDragable = false;

  private cells: Array<ChessCell> = [];

  private configFigures: Map<string, string>;

  private chessMode = '';

  constructor(parentNode: HTMLElement, configFigures: Map<string, string>, parentHeight: number) {
    super(parentNode, 'div', chessStyles.chess_board);
    // this.node.style.width = `${parentHeight}px`;
    // this.node.style.height = `${parentHeight}px`;

    // this.node.style.setProperty('--size', `${parentHeight}px`);
    this.configFigures = configFigures;

    const boardView = new Control(this.node, 'div', chessStyles.chess_board_view);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let color = '';
        if (i % 2 === 0) {
          color = j % 2 === 0 ? chessStyles.cell_light : chessStyles.cell_dark;
          const cell = new ChessCell(boardView.node, new Vector(j, i), color, parentHeight/8);
          this.cells.push(cell);
        } else if (i % 2 !== 0) {
          color = j % 2 === 0 ? chessStyles.cell_dark : chessStyles.cell_light;
          const cell = new ChessCell(boardView.node, new Vector(j, i), color, parentHeight/8);
          this.cells.push(cell);
        }
      }
    }

    this.figure = null;
    this.node.onmousedown = (e) => {
      if (this.isDragable && this.figure) {
        this.onFigureDropOnCell(e);
        this.onFigureGrab(this.figure.getFigureState());
      }
    };
  }

  createFieldCells(fen: Array<string>): void {
    this.dragableItems = new Control(this.node, 'div');
    this.dragableField = new Control(this.node, 'div', chessStyles.chess_field);

    for (let i = 0; i < 64; i++) {
      const cell = new Control(this.dragableField.node, 'div', chessStyles.chess_cell);
      const cellCoord = new Vector(i % 8, Math.floor(i / 8));
      if (fen[i]) {
        const fig = fen[i];
        let rotate = false;
        if (this.chessMode === chessModeConfig.oneScreen) {
          rotate = fen[i] !== fen[i].toUpperCase();
        }

        this.addItem(new Figure(null, this.configFigures.get(fen[i]), cellCoord, rotate), i);
      }

      cell.node.onmouseenter = () => {
        cell.node.classList.add(chessStyles.chess_cell_hover);
      };
      cell.node.onmouseleave = () => {
        cell.node.classList.remove(chessStyles.chess_cell_hover);
      };
      cell.node.onmouseup = () => {
        this.onCellDrop && this.onCellDrop(this.figure, new Vector(i % 8, Math.floor(i / 8)));
        const cellPos = new Vector(i % 8, Math.floor(i / 8));
        this.onFigureDrop(this.figure.getFigureState(), cellPos);
        this.setDragable(false);
      };
    }
    this.dragableField.node.style.display = 'none';
    this.dragableField.node.onmousemove = (e: MouseEvent) => {
      if (window.getComputedStyle(this.node).transform !== 'none' && e.buttons == 1) {
        if (this.figure) {
          this.onFigureMoveWithTransform(e);
        }
      } else if (e.buttons == 1) {
        this.onFigureMoveWithoutTransform(e);
      }
    };

    this.dragableField.node.onmouseup = (e) => {
      this.dragableField.node.style.display = 'none';
      // this.figure = null;
    };
    this.node.onmouseenter = (e: MouseEvent) => {
      if (e.buttons != 1) {
        this.dragableField.node.onmouseup(e);
      }
    };
  }

  addItem(instance: Figure, i: number): void {
    const figPos = new Vector(i % 8, Math.floor(i / 8));
    const figure = instance;

    this.dragableItems.node.appendChild(figure.node);
    figure.setFigurePosition(figPos);
    figure.onDragStart = (startPos: Vector) => {
      if (this.isDragable) {
        this.dragableField.node.style.display = '';
        this.startChildPos = startPos;
        this.figure = figure;
      }
    };
    this.items.push(figure);
  }

  onFigureMoveWithTransform(e: MouseEvent) {
    const trasformOrigin = window
      .getComputedStyle(this.node)
      .transformOrigin.split(' ')
      .map((item) => Number(parseFloat(item)));
    const origin = new Vector(trasformOrigin[0], trasformOrigin[1]);
    let x = Math.floor(e.clientX - this.node.offsetLeft);
    let y = Math.floor(e.clientY - this.node.offsetTop + getGlobalScroll(this.node.parentElement));
    const mousePos = new Vector(x, y).sub(origin);

    const matrix = window
      .getComputedStyle(this.node)
      .transform.slice(7, -1)
      .split(', ')
      .map((item) => Number(item));

    x = matrix[0] * mousePos.x + matrix[1] * mousePos.y;
    y = matrix[2] * mousePos.x + matrix[3] * mousePos.y;
    const movePos = new Vector(x, y).sub(this.startChildPos).add(origin);
    // this.figure.setFigurePosition(movePos, this.cellBox);

    this.figure.node.style.left = `${movePos.x}px`;
    this.figure.node.style.top = `${movePos.y}px`;
  }

  onFigureMoveWithoutTransform(e: MouseEvent) {
    if (this.figure) {
      const movePos = new Vector(
        e.clientX - this.node.offsetLeft,
        e.clientY - this.node.offsetTop + getGlobalScroll(this.node)
      ).sub(this.startChildPos);
      this.figure.node.style.left = `${movePos.x}px`;
      this.figure.node.style.top = `${movePos.y}px`;
    }
  }

  onFigureDropOnCell(e: MouseEvent) {
    e.preventDefault();
    const fieldBox = this.dragableField.node.getBoundingClientRect();

    const ratio = Math.floor(fieldBox.width / 8);
    if (window.getComputedStyle(this.node).transform !== 'none' && e.buttons == 1) {
      const matrix = window
        .getComputedStyle(this.node)
        .transform.slice(7, -1)
        .split(', ')
        .map((item) => Number(item));
      let x = Math.floor((e.clientX - this.node.offsetLeft) / ratio);
      let y = Math.floor((e.clientY - this.node.offsetTop + getGlobalScroll(this.node)) / ratio);

      x = matrix[0] * x + matrix[1] * y;
      y = matrix[2] * x + matrix[3] * y;
      this.startCellPos = new Vector(Math.floor(x), Math.floor(y));
    } else if (e.buttons == 1) {
      this.startCellPos = new Vector(
        Math.floor((e.clientX - this.node.offsetLeft) / ratio),
        Math.floor((e.clientY - this.node.offsetTop + getGlobalScroll(this.node)) / ratio)
      );
    }
  }

  setFigurePosition(oldFigPos: Vector, newFigPos: Vector): void {
    const figItem = this.items.find(
      (figure) =>
        figure.getFigureState().x === oldFigPos.x && figure.getFigureState().y === oldFigPos.y
    );
    figItem.setFigureState(newFigPos);
    this.isDragable = true;
  }

  setDragable(status: boolean): void {
    this.isDragable = status;
  }

  showAllowedMoves(coords: Array<Vector>): void {
    coords.forEach((coord) => {
      this.cells.forEach((cell) => {
        if (cell.getCellCoord().x === coord.x && cell.getCellCoord().y === coord.y) {
          cell.setAllowedMove();
        }
      });
    });
  }

  removeAllowedMoves(): void {
    this.cells.forEach((cell) => cell.removeAllowedMove());
  }

  showRivalMoves(coords: Array<Vector>): void {
    coords.forEach((coord) => {
      this.cells.forEach((cell) => {
        if (cell.getCellCoord().x === coord.x && cell.getCellCoord().y === coord.y) {
          cell.setRivalMove();
        }
      });
    });
  }

  removeRivalMoves(): void {
    this.cells.forEach((cell) => cell.removeRivalMove());
  }

  removeKingCheck(): void {
    this.cells.forEach((cell) => cell.removeKingCell());
  }

  removeMateMoves(): void {
    this.cells.forEach((cell) => cell.removeMateMove());
  }

  showRecommendedMoves(coords: Array<Vector>): void {
    coords.forEach((coord) => {
      this.cells.forEach((cell) => {
        if (cell.getCellCoord().x === coord.x && cell.getCellCoord().y === coord.y) {
          cell.setRecommendedMove();
        }
      });
    });
  }

  removeRecommendedMoves(): void {
    this.cells.forEach((cell) => cell.removeRecommendedMove());
  }


  clearData(fen: Array<string>): void {
    this.dragableItems && this.dragableItems.destroy();
    this.dragableField.destroy();
    this.createFieldCells(fen);
    // this.isDragable = false;
  }

  setChessMode(chessMode: string): void {
    this.chessMode = chessMode;
  }

  showKingCheck(kingInfo: IKingInfo): void {
    if (kingInfo.coords) {
      // this.cells.forEach((cell) => cell.removeKingCell());
      const kingCell = this.cells.find(
        (cell) =>
          cell.getCellCoord().x === kingInfo.coords.x && cell.getCellCoord().y === kingInfo.coords.y
      );
      kingCell.setKingCell();
    }

    if (kingInfo.rival) {
      kingInfo.rival.forEach((coord) => {
        this.cells.forEach((cell) => {
          if (cell.getCellCoord().x === coord.x && cell.getCellCoord().y === coord.y) {
            cell.setRivalMove();
          }
        });
      });
    }
  }

  showKingMate(kingInfo: IKingInfo): void {
    if (kingInfo.coords) {
      // this.cells.forEach((cell) => cell.removeKingCell());
      const kingCell = this.cells.find(
        (cell) =>
          cell.getCellCoord().x === kingInfo.coords.x && cell.getCellCoord().y === kingInfo.coords.y
      );
      kingCell.setKingCell();
    }

    if (kingInfo.rival) {
      kingInfo.rival.forEach((coord) => {
        this.cells.forEach((cell) => {
          if (cell.getCellCoord().x === coord.x && cell.getCellCoord().y === coord.y) {
            cell.setMateMove();
          }
        });
      });
    }
  }

  changeHeight(size: number): void {
    this.node.style.setProperty('--size', `${size}px`);
  }
}

export default ChessField;

function getGlobalScroll(el: HTMLElement) {
  const getScroll = (el: HTMLElement, scrollValue: number) => {
    let nextValue = el.scrollTop + scrollValue;

    if (el.parentElement) {
      nextValue = getScroll(el.parentElement, nextValue);
    }
    return nextValue;
  };
  return getScroll(el, 0);
}
