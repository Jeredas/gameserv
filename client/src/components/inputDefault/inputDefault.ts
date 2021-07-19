import Control from "../utilities/control";

class Input extends Control {
  node!: HTMLInputElement;

  public onKeyUp: (e: KeyboardEvent) => void = () => {}
  
  constructor(parentNode: HTMLElement, type: string, name: string, value = '', placeHolder = '') {
    super(parentNode, 'input');
    this.node.type = type;
    this.node.name = name;
    this.node.placeholder = placeHolder;
    this.node.value = value;

    this.node.onkeyup = (e: KeyboardEvent) => {
      this.onKeyUp(e);
    }
  }

  getCheckedStatus(): boolean {
    return this.node.checked;
  }

  getValue(): string {
    return this.node.value;
  }

  setChecked(status: boolean): void {
    this.node.checked = status;
  }

  setValue(value: string): void {
    this.node.value = value;
  }

}

export default Input;