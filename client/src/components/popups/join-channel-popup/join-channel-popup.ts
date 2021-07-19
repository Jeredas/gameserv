import { IJoinChannelPopupLangs, joinChannelPopupLangEn } from '../../utilities/configPopup';
import ButtonDefault from '../../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../../inputWrapper/inputWrapper';
import Control from '../../utilities/control';
import popupStyles from '../popupService/popupService.module.css';



class JoinChannelPopup extends GenericPopup<any> {
  protected popupWrapper: Control;

  private searchField: InputWrapper;

  private joinBtn: ButtonDefault;

  private cancelBtn: ButtonDefault;

  public onSelect: (value: string) => void;

  constructor(parentNode:HTMLElement, langConfig:IJoinChannelPopupLangs = joinChannelPopupLangEn) {
    super(parentNode);
    this.searchField = new InputWrapper(this.popupWrapper.node, langConfig.searchFieldLabel, () => null, langConfig.searchFieldPlaceHolder, '', 'text');
    this.popupWrapper.node.classList.add(popupStyles.wrapper_join);
    const wrapperBtns = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_btns);
    this.joinBtn = new ButtonDefault(wrapperBtns.node, popupStyles.settings_button, langConfig.joinButtonText);
    this.cancelBtn = new ButtonDefault(wrapperBtns.node, popupStyles.settings_button, langConfig.cancelButtonText);

    this.joinBtn.onClick = () => {
      this.onSelect(this.searchField.getValue());
    }

    this.cancelBtn.onClick = () => {
      this.destroy();
    }
  }
}

export default JoinChannelPopup;