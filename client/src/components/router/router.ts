import { Route } from "./route";

export class Router {
  public routes:Array<Route> = [];
  private defaultRoute: string;

  constructor(defaultRoute: string) {
    window.onpopstate = () => this.processHash();
    this.defaultRoute = defaultRoute;
  }

  processHash() {
    const hash = window.location.hash.slice(1);
    console.log(hash);
    const isSuccess = this.activateRouteByName(hash);
    if(!isSuccess) {
      this.selectPage(this.defaultRoute);
    }
  }

  private activateRouteByName(name:string) {
    let isActivated = false;
    this.routes.forEach((route) => {
      if (route.pageName === name) {
        route.activate();
        isActivated = true;
      } else {
        route.deactivate();
      }
    });
    return isActivated;
  }

  addRoute(route:Route) {
    route.deactivate();
    this.routes.push(route);
  }

  removeRoute(name:string) {
    const routeItem = this.routes.find((item) => item.pageName === name);
    this.routes = this.routes.filter((item) => item !== routeItem);
    routeItem.deactivate();
  }

  selectPage(name: string) {
    window.location.hash = `#${name}`;
  }
}
