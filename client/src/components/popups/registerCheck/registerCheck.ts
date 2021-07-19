import ButtonDefault from '../../buttonDefault/buttonDefault';
import GenericPopup from '../genericPopup/genericPopup';
import Control from '../../utilities/control';
import popupStyles from '../popupService/popupService.module.css';

class RegisterCheck extends GenericPopup<string> {
  popupWrapper: Control;
  buttonSignIn: ButtonDefault;
  buttonSignUp: ButtonDefault
  onSelect: (value: string) => void;
  buttonClose: ButtonDefault;
  constructor(parentNode:HTMLElement) {
    super(parentNode);
    this.popupWrapper.node.classList.add(popupStyles.register_check)
    const wrapperAuth = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_auth);
    const authTitle =  new Control(wrapperAuth.node, 'div', popupStyles.title_checked_auth, 'Welcome Back!');
    const authSubtitle =  new Control(wrapperAuth.node, 'div', popupStyles.description_auth, 'To keep connected with us please log in with your personal info');
    this.buttonSignIn = new ButtonDefault(wrapperAuth.node,popupStyles.settings_button, 'SIGN IN');

    const wrapperReg = new Control(this.popupWrapper.node, 'div', popupStyles.wrapper_reg);
    const regTitle =  new Control(wrapperReg.node, 'div', popupStyles.title_checked_reg, 'Create Account');
    const regSubtitle =  new Control(wrapperReg.node, 'div', popupStyles.description_reg, 'Do not you have an account yet?');
    this.buttonSignUp = new ButtonDefault(wrapperReg.node, popupStyles.settings_button, 'SIGN UP');
    this.buttonClose = new ButtonDefault(wrapperReg.node, popupStyles.close_button, '');
    this.buttonSignIn.onClick = () => {
      this.onSelect('SignIn');
    }

    this.buttonSignUp.onClick = () => {
      this.onSelect('SignUp');
    }
    this.buttonClose.onClick = () => {
      this.onSelect('Close');
      this.destroy();
    }
  }
}

export default RegisterCheck;