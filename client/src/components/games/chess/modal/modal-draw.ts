import Control from "../../../utilities/control";
import Button from '../chess-button';
import modalStyles from './modal.module.css';

class ModalDraw extends Control {
  private modalMessage: Control;

  private messageHead: Control;

  private messageBody: Control;

  private btnOk: Button;

  public onModalDrawClick: (response: string) => void = () => {};
  private btnAgree: Button;
  private btnDisagree: Button;

  constructor(
    parentNode: HTMLElement,
    status: string,
    host: string,
    players: Array<string>,
    method: string
  ) {
    super(parentNode, 'div', modalStyles.modal_wrapper);
    this.modalMessage = new Control(this.node, 'div', modalStyles.modal_message);
    let messageDraw = 'Claim a draw. Nobody won, nobody lost';
    const player = players.find((player) => player !== host);
    let messageLoss = `Claim a loss. ${host} lost${player ? `, ${player} won` : ''}`;

    this.messageHead = new Control(this.modalMessage.node, 'div', modalStyles.modal_text);
    this.messageBody = new Control(this.modalMessage.node, 'div', modalStyles.modal_text);

    if (method === 'drawSingleGame') {
      messageDraw = 'You have claimed a draw. Nobody won, nobody lost';
      this.btnOk = new Button(this.modalMessage.node, 'OK');
      this.btnOk.onClick = () => {
        this.onModalDrawClick('ok');
      };
    }

    if (method === 'drawNetwork') {
      messageDraw = `You have claimed a draw. Please wait your rival's response`;
    }

    if (method === 'drawAgreeNetwork') {
      messageDraw = 'Your rival has claimed a draw. Please make a choice';
      this.btnAgree = new Button(this.modalMessage.node, 'Agree');
      this.btnAgree.onClick = () => {
        this.onModalDrawClick('agree');
      };

      this.btnDisagree = new Button(this.modalMessage.node, 'Disagree');
      this.btnDisagree.onClick = () => {
        this.onModalDrawClick('disagree');
      };
    }
    this.messageBody.node.textContent = status === 'draw' ? messageDraw : messageLoss;
  }
}
export default ModalDraw;
