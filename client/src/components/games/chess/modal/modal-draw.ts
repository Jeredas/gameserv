import Control from "../../../utilities/control";
import ChessButton from "../chess-button";
import modalStyles from './modal.module.css';

class ModalDraw extends Control {
  private modalMessage: Control;

  private messageHead: Control;

  private messageBody: Control;

  private btnOk: ChessButton;

  public onModalDrawClick: (response: string) => void = () => {};
  private btnAgree: ChessButton;
  private btnDisagree: ChessButton;

  constructor(
    parentNode: HTMLElement,
    status: string,
    host: string,
    players: Array<string>,
    method: string
  ) {
    super(parentNode, 'div', modalStyles.modal_wrapper);
    console.log('Client', method);
    
    this.modalMessage = new Control(this.node, 'div', modalStyles.modal_message);
    let messageDraw = 'Claim a draw. Nobody won, nobody lost';
    const player = players.find((player) => player !== host);
    let messageLoss = `Claim a loss. ${host} lost${player ? `, ${player} won` : ''}`;
    this.messageBody = new Control(this.modalMessage.node, 'div', modalStyles.modal_text);

    if (method === 'drawSingle') {
      messageDraw = 'You have claimed a draw. Nobody won, nobody lost';
      this.btnOk = new ChessButton(this.modalMessage.node, 'OK');
      this.btnOk.node.classList.add(modalStyles.btn_modal);
      this.btnOk.onClick = () => {
        this.onModalDrawClick('ok');
      };
    }

    if (method === 'drawNetwork') {
      messageDraw = `You have claimed a draw. Please wait your rival's response`;
    }

    if (method === 'drawAgreeNetwork') {
      this.messageHead = new Control(this.modalMessage.node, 'div', modalStyles.modal_text);
      messageDraw = 'Your rival has claimed a draw. Please make a choice';
      this.btnAgree = new ChessButton(this.modalMessage.node, 'Agree');
      this.btnAgree.node.classList.add(modalStyles.btn_modal);
      this.btnAgree.onClick = () => {
        this.onModalDrawClick('agree');
      };

      this.btnDisagree = new ChessButton(this.modalMessage.node, 'Disagree');
      this.btnDisagree.onClick = () => {
        this.onModalDrawClick('disagree');
      };
    }
    this.messageBody.node.textContent = status === 'draw' ? messageDraw : messageLoss;
  }
}
export default ModalDraw;
