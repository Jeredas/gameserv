import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import chessStyles from './chess-game.module.css';

class Figure extends Control {
  public onDragStart: (startPos: Vector) => void = () => {};

  private figurePos: Vector;

  private figPic: string;

  private isDragable = false;

  constructor(
    parentNode: HTMLElement,
    figure: string,
    _figurePos: Vector,
    rotate: boolean,
  ) {
    super(parentNode, 'div', chessStyles.drag_item);
    this.node.style.width = `${100 / 8}%`;
    this.node.style.height = `${100 / 8}%`;
    this.figurePos = _figurePos;
    this.figPic = figure;
    const inner = new Control(this.node, 'div', chessStyles.drag_item_inner);
    inner.node.style.backgroundImage = `url(${figure})`;
    if (rotate) {
      this.node.classList.add('figure-rotate');
    }

    this.node.onmousedown = (e) => {
      const startPos = new Vector(e.offsetX, e.offsetY);
      this.onDragStart(startPos);
    };
    this.node.ondragstart = (e) => {
      e.preventDefault();
    };
  }

  setFigureState(figPos: Vector): void {
    this.figurePos = figPos.clone();
    this.setFigurePosition(figPos);
  }

  getFigureState(): Vector {
    return this.figurePos.clone();
  }

  setFigurePosition(figPos: Vector): void {
    this.node.style.left = `${100 / 8 * figPos.x}%`;
    this.node.style.top = `${100 / 8 * figPos.y}%`;
  }

  setFigureDragable(status: boolean): void {
    this.isDragable = status;
  }
}

export default Figure;
