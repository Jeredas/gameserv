interface IRoute{
  name:string;
  processFunction: (params:any, userAccessData:any)=>Promise<any>;
}

export class Router{
  private routes: Array<IRoute>;
  constructor(){
    this.routes = [];
  }

  defaultResponse(){
    return new Promise((resolve, reject)=>{
      resolve('default');
    });
  }

  route(name:string, params:any, userData:any):Promise<any>{
    console.log(name);
    let currentRoute = this.routes.find(route=>{
      return route.name == name;
    });
    if (currentRoute){
      return currentRoute.processFunction(params, userData);
    } else {
      return this.defaultResponse();
    }
  }
  
  addRoute(name:string, func){
    console.log('endpoint init: ' + name);
    this.routes.push({name: name, processFunction: func});
  }
}

export const router = new Router();