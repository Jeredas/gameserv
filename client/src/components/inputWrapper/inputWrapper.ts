import Control from '../utilities/control';
import popupStyle from '../popupService/popupService.module.css';

class InputWrapper extends Control {
  public node: HTMLInputElement;

  public onValidate: (param: string) => Promise<string | null>;

  error: Control;

  field: Control;

  caption: Control;

  name: string;

  private timer: NodeJS.Timeout;

  public onValueEnter: (input: string) => void = () => {};

  constructor(parentNode: HTMLElement, caption: string, onValidate: (param: string) => Promise<string | null>, placeHolder = '', id = 'input', type = '') {
    super(parentNode, 'div', popupStyle.input_wrapper);
    this.name = caption;
    this.caption = new Control(this.node, 'div', popupStyle.caption);
    this.caption.node.innerHTML = caption;
    this.field = new Control(this.node, 'input', popupStyle.input_field, `${id}`);
    this.field.node.id = id;
    (this.field.node as HTMLInputElement).placeholder = `${placeHolder}`;
    (this.field.node as HTMLInputElement).type = type;
    this.error = new Control(this.node, 'div', popupStyle.input_error);
    this.onValidate = onValidate;
    this.field.node.oninput = async () => {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        if (this.onValidate) {
          this.setError(await this.onValidate(this.getValue()));
        }
      }, 2000);
      this.onValueEnter(this.getValue());
    };
  }

  getValue():string {
    return (this.field.node as HTMLInputElement).value;
  }
  setError(err: string | null) {
    if (err === null) {
      this.error.node.innerHTML = 'ok';
      // this.field.node.classList.remove('invalid');
      // this.field.node.classList.add('valid');
    } else {
      this.error.node.textContent = err;
      // this.field.node.classList.add('invalid');
      // this.field.node.classList.remove('valid');
    }
  }
}

export default InputWrapper;