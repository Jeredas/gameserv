import Vector from "../../utilities/vector";
import Control from "../../utilities/control";


class Cell extends Control {
  public onCellClick: (coords: Vector) => void = () => {};

  coords: Vector;

  constructor(parentNode: HTMLElement, cellStyle: string, coords:Vector) {
    super(parentNode, 'div', cellStyle);
    this.coords = coords;
      
    this.node.onclick = () => {
      this.onCellClick(this.coords);
    };
  }

  getCellCoord(): Vector {
    return this.coords;
  }

  clickedCell(sign: string) {
    this.node.classList.add('clicked');
    this.node.textContent = sign;
  }

  clearCell() {
    this.node.classList.remove('clicked');
    this.node.textContent = '';
  }
}

export default Cell;
