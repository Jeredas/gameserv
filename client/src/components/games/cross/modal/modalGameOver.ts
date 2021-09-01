import Control from '../../../utilities/control';
import CrossButton from '../button/cross-button';
import modalStyles from './modal.module.css';

class ModalGameOver extends Control {
  private modalMessage: Control;

  private messageHead: Control;

  private messageBody: Control;

  private btnOk: CrossButton;

  public onGameOverClick: () => void = () => {};

  constructor(parentNode: HTMLElement, params: {method: string, player: string}, players: Array<string>) {
    super(parentNode, 'div', modalStyles.modal_wrapper);
    this.modalMessage = new Control(this.node, 'div', modalStyles.modal_message);
    const rivalPlayer = players.find(playerItem => params.player !== playerItem );
    let messageDraw = 'There is a game draw. Nobody won, nobody lost';
    let messageLost = `You have lost. The player ${params.player} won`;
    let messageWon = `You have won. The player ${params.player} lost`;
    let messageNoMoves = 'No more moves!';

    this.messageHead = new Control(this.modalMessage.node, 'div', modalStyles.modal_text);
    this.messageBody = new Control(this.modalMessage.node, 'div', modalStyles.modal_text);

    if (params.method === 'draw') {
      this.messageBody.node.textContent = messageDraw;
    }

    if (params.method === 'won') {
      this.messageBody.node.textContent = messageWon;
    }

    if (params.method === 'lost') {
      this.messageBody.node.textContent = messageLost;
    }

    if (params.method === 'noMoves') {
      this.messageBody.node.textContent = messageNoMoves;
    }

    this.btnOk = new CrossButton(this.modalMessage.node, 'OK');
    this.btnOk.onClick = () => {
      this.onGameOverClick();
    };
  }
}
export default ModalGameOver;
