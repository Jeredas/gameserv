import Control from '../utilities/control';

class InputWrapper extends Control {
  public node: HTMLInputElement;

  public onValidate: (param: string) => Promise<string | null>;

  error: Control;

  field: Control;

  caption: Control;

  name: string;

  private timer: NodeJS.Timeout;

  constructor(parentNode: HTMLElement, caption: string, onValidate: (param: string) => Promise<string | null>, placeHolder = '', id = 'input', type = '') {
    super(parentNode, 'div', 'authform_input');
    this.name = caption;
    this.caption = new Control(this.node, 'div', 'caption');
    this.caption.node.innerHTML = caption;
    this.field = new Control(this.node, 'input', 'field_input', `${id}`);
    (this.field.node as HTMLInputElement).placeholder = `${placeHolder}`;
    (this.field.node as HTMLInputElement).type = type;
    this.error = new Control(this.node, 'div', 'input_error');
    this.onValidate = onValidate;
    this.field.node.oninput = async () => {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        if (this.onValidate) {
          this.setError(await this.onValidate(this.getValue()));
        }
      }, 2000);
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