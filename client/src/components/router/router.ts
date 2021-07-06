import { Route } from "./route";

export class Router {
  public routes:Array<Route> = [];

  constructor() {
    window.onpopstate = () => this.processHash();
  }

  processHash() {
    const hash = window.location.hash.slice(1);
    console.log(hash);
    this.activateRouteByName(hash);
  }

  activateRouteByName(name:string) {
    this.routes.forEach((route) => {
      if (route.pageName === name) {
        route.activate();
      } else {
        route.deactivate();
      }
    });
  }

  addRoute(route:Route) {
    route.deactivate();
    this.routes.push(route);
  }
}
