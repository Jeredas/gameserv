import ButtonDefault from '../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import InputWrapper from '../inputWrapper/inputWrapper';
import Control from '../utilities/control';

class SettingsUser extends GenericPopup<any> {
  changeAvatar: Control;
  avatarLoaderSettings: InputWrapper;
  name: InputWrapper;
  saveButton: ButtonDefault;
  cancelButton: ButtonDefault;

  onSelect: (value: any) => void;
  logOutButton: ButtonDefault;

  constructor(parentNode:HTMLElement) {
    super(parentNode);
    this.changeAvatar = new Control(this.popupWrapper.node, 'label', '', 'set your avatar');
    this.changeAvatar.node.setAttribute('for', 'avatarloader');
    this.avatarLoaderSettings = new InputWrapper(this.changeAvatar.node, '',async()=>{return null}, 'AvatarLoader', 'avatarLoader', 'file');
    this.name = new InputWrapper(this.popupWrapper.node, 'name',async()=>{return null}, 'name', 'name');

    this.saveButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'Save');
    this.cancelButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'Cancel');
    this.logOutButton = new ButtonDefault(this.popupWrapper.node, 'button_default', 'Log out');
    this.saveButton.onClick = () =>{
      //TODO:Обработать данные из инпута , отправить на сервер и записать изменения в бд.Вернуть новые имя и аву наружу.
      this.onSelect('save');
    }
    this.cancelButton.onClick = () =>{
      //TODO:Очистить поля инпутов
      this.onSelect('cancel')
    }
    this.logOutButton.onClick = () =>{
      localStorage.removeItem('todoListApplicationSessionId');
      this.onSelect('logOut')
    }
  }
}

export default SettingsUser;