export class Route {
  public linkName: string;

  public pageName: string;

  public onActivate: ()=>void;

  public onDeactivate: ()=>void;

  constructor(pageName:string, linkName:string, onActivate:()=>void, onDeactivate:()=>void) {
    this.linkName = linkName;
    this.pageName = pageName;
    this.onActivate = onActivate;
    this.onDeactivate = onDeactivate;
  }

  activate() {
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();
  }
}