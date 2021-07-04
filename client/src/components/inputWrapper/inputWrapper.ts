import Control from '../utilities/control';

class InputWrapper extends Control {
  public node: HTMLInputElement;

  // public onValidate: (param: string) => Promise<string | null>;

  error: Control;

  field: Control;

  caption: Control;

  name: string;

  constructor(parentNode: HTMLElement, caption: string, placeHolder = '', id = 'input', type = '') {
    super(parentNode, 'div', 'authform_input');
    this.name = caption;
    this.caption = new Control(this.node, 'div', 'caption');
    this.caption.node.innerHTML = caption;
    this.field = new Control(this.node, 'input', 'field_input', `${id}`);
    (this.field.node as HTMLInputElement).placeholder = `${placeHolder}`;
    (this.field.node as HTMLInputElement).type = type;
    this.error = new Control(this.node, 'div', 'input_error');
  }

  getValue():string {
    return (this.field.node as HTMLInputElement).value;
  }
}

export default InputWrapper;