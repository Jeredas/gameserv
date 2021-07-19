import Vector from '../../utilities/vector';
import Control from '../../utilities/control';
import crossStyles from './cross.module.css';
import crossIcons from './configCross';

class Cell extends Control {
  public onCellClick: (coords: Vector) => void = () => {};

  private coords: Vector;
  private cellSign: Control;

  constructor(parentNode: HTMLElement, cellStyle: string, coords: Vector) {
    super(parentNode, 'div', cellStyle);
    this.node.style.backgroundImage = `url(${crossIcons.get('cellBg')})`;
    this.cellSign = new Control(this.node, 'div');
    this.cellSign.node.classList.add(crossStyles.cross_cell_sign);
    const cellCover = new Control(this.cellSign.node, 'div');
    cellCover.node.classList.add(crossStyles.cross_cell_cover);
    this.coords = coords;

    this.node.onclick = () => {
      this.onCellClick(this.coords);
    };
  }

  getCellCoord(): Vector {
    return this.coords;
  }

  clickedCell(sign: string) {
    this.node.classList.add(crossStyles.clicked);
    this.cellSign.node.style.backgroundImage = `url(${crossIcons.get(sign)})`;
  }

  clearCell() {
    this.node.classList.remove(crossStyles.clicked);
    this.cellSign.node.style.backgroundImage = '';
  }
}

export default Cell;
