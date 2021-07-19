import popupStyles from '../popupService/popupService.module.css'
import GenericPopup from '../genericPopup/genericPopup';
import ButtonDefault from '../../buttonDefault/buttonDefault';
import Control from '../../utilities/control';
import { gameIcons, gameSetPopup } from '../../utilities/configPopup';

export class GameSelectPopup extends GenericPopup<string> {
  buttonChess: ButtonDefault;

  buttonCross:ButtonDefault;

  closeBtn:ButtonDefault;

  popupWrapper:Control;

  wrapperButtons:Control;

  onSelect: (value: string) => void;

  constructor(parentNode: HTMLElement) {
    super(parentNode);
    const titleSelectGame = new Control(this.popupWrapper.node, 'div', popupStyles.title_game_select, 'Choose a type channel');
    this.wrapperButtons = new Control(this.popupWrapper.node, 'div', popupStyles.games);
    this.closeBtn = new ButtonDefault(this.popupWrapper.node, popupStyles.close_button, '');
    this.closeBtn.onClick = () => {
      this.destroy();
    }
    gameSetPopup.forEach((channelType) => {
      const button = new ButtonDefault(this.wrapperButtons.node, popupStyles.game_icon, '');
      button.node.style.backgroundImage = `url(${gameIcons.get(channelType)})`;
      
      button.onClick = () => {
        this.onSelect(channelType);
      };
    });
  }
}
