import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';
import popupStyles from '../popupService/popupService.module.css';
import inputDefault from '../inputDefault/inputDefault';
import defaultAvatar from '../../assets/select-game-popup/avat-def.png';


class SettingsUser extends GenericPopup<any> {
  changeAvatar: Control;
  avatarLoaderSettings: inputDefault;
  name: InputWrapper;
  saveButton: ButtonDefault;
  cancelButton: ButtonDefault;

  onSelect: (value: any) => void;

  constructor(parentNode:HTMLElement) {
    super(parentNode);
    this.popupWrapper.node.classList.add(popupStyles.settings_user)
    const titleAvatar = new Control(this.popupWrapper.node, 'div', popupStyles.title_avatar, 'You can change your avatar below')
    this.changeAvatar = new Control(this.popupWrapper.node, 'label', popupStyles.label_avatar);
    this.changeAvatar.node.style.backgroundImage = `url(${defaultAvatar})`;
    this.changeAvatar.node.setAttribute('for', 'avatarLoader');
    this.avatarLoaderSettings = new inputDefault(this.changeAvatar.node, 'file', 'fileLoader');
    this.avatarLoaderSettings.node.id = 'avatarLoader'
    this.name = new InputWrapper(this.popupWrapper.node, 'You can change your name in the field below',async()=>{return null}, 'Enter your new name', 'name');
    const wrapperButtons = new Control(this.popupWrapper.node, 'div', popupStyles.games);
    this.saveButton = new ButtonDefault(wrapperButtons.node, popupStyles.settings_button, 'Save');
    this.cancelButton = new ButtonDefault(wrapperButtons.node,  popupStyles.settings_button, 'Cancel');

    this.saveButton.onClick = () =>{
      //TODO:Обработать данные из инпута , отправить на сервер и записать изменения в бд.Вернуть новые имя и аву наружу.
      this.onSelect('save');
    }
    this.cancelButton.onClick = () =>{
      //TODO:Очистить поля инпутов
      this.onSelect('cancel')
    }
  }
}

export default SettingsUser;