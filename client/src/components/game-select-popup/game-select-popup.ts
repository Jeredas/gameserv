import chessIcon from '../../assets/select-game-popup/chess.png';
import crossIcon from '../../assets/select-game-popup/cross.png';
import chatIcon from '../../assets/select-game-popup/chat.png';
import popupStyles from '../popupService/popupService.module.css'
import GenericPopup from '../genericPopup/genericPopup';
import ButtonDefault from '../buttonDefault/buttonDefault';
import Control from '../utilities/control';


export const gameSetPopup = [ 'chess', 'cross', 'chat'];

export const gameIcons = new Map<string, string>([
  ['chess', chessIcon],
  ['cross', crossIcon],
  ['chat', chatIcon]
]);

export class GameSelectPopup extends GenericPopup<string> {
  buttonChess: ButtonDefault;

  buttonCross:ButtonDefault;

  closeBtn:ButtonDefault;

  popupWrapper:Control;

  wrapperButtons:Control;

  onSelect: (value: string) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const titleSelectGame = new Control(this.popupWrapper.node, 'div', popupStyles.title_game_select, 'Choose a game');
    this.wrapperButtons = new Control(this.popupWrapper.node, 'div', popupStyles.games);
    this.closeBtn = new ButtonDefault(this.popupWrapper.node, popupStyles.close_button, '');
    this.closeBtn.onClick = () => {
      this.destroy();
    }
    gameSetPopup.forEach((game) => {
      const button = new ButtonDefault(this.wrapperButtons.node, popupStyles.game_icon, '');
      button.node.style.backgroundImage = `url(${gameIcons.get(game)})`;
      
      button.onClick = () => {
        this.onSelect(game);
      };
    });
  }
}
