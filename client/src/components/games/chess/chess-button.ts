import Control from "../../utilities/control";
import chessStyles from './chess-game.module.css';

class ChessButton extends Control {
node!: HTMLButtonElement;

  public onClick: () => void = () => {};


  constructor(parentNode: HTMLElement, btnContent: string) {
    super(parentNode, 'button', chessStyles.chess_button, btnContent);
    this.node.onclick = () => {
      this.onClick();
    };
  }

  buttonDisable(): void {
    this.node.setAttribute('disabled', 'true');
    this.node.classList.add(chessStyles.disabled);
  }

  buttonEnable(): void {
    this.node.removeAttribute('disabled');
    this.node.classList.remove(chessStyles.disabled);
  }
}

export default ChessButton;
