import Signal from "../../socketClient/signal";

export class State <dataType> {
  private data: dataType;
  public onUpdate: Signal<{from:dataType,to:dataType}> = new Signal();
  constructor(initialState:dataType) {
    this.data = initialState;
  }

  setData(data: dataType) {
    const lastData = this.data;
    this.data = data;
    this.onUpdate.emit({from:lastData,to:this.data});
  }

  getData() {
    return this.data;
  }
}