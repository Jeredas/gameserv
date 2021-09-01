import { adminService } from './adminService';
import { statService } from './statService';
import http from 'http';
import { authService } from './authService';
import { router } from './httpRouter';

function paramsParser(paramsString: string): any {
  let params = {};
  paramsString.split(/[&]+/).forEach((it) => {
    let entry = it.split('=');
    params[entry[0]] = entry[1];
  });
  return params;
}

class Server {
  server: http.Server;
  constructor() { }

  response(res: http.ServerResponse, value: string) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
    });

    res.write(value);
    res.end();
  }

  private async processRequest(req, res) {
    let entry = req.url.split('?');
    let route = entry[0].slice(1);
    let params;
    if(req.method === 'POST') {
      params = paramsParser(await parseBody(req));
    } else {
      params = paramsParser(entry[1] || '');
    } 
    try {
      let userData = null;
      if (params.sessionId) {
        userData = await authService.getUserBySessionId(params.sessionId);
      }
      let result = await router.route(route, params, userData);
      this.response(res, JSON.stringify(result));
    } catch (err) {
      this.response(res, JSON.stringify(err));
    }
  }

  async start(port:number = 4040) {
    return authService.start(router).then(isAuthStarted=>{
      if (isAuthStarted){
        statService.start(router).then(()=>{
          console.log('stat Service started')
        })
        adminService.start(router).then(()=>{
          console.log('admin Service Started')
        })
        this.server = http.createServer((req, res)=>this.processRequest(req, res)).listen(port);
        return true;
      } else {
        throw new Error("Auth service start error.");
      }
    });
  }
}

export const httpServer = new Server();

function parseBody (req): Promise<string> {
  return new Promise((res,rej)=>{
    let body = '';
  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    console.log(req.url);
    res(body)
  }); 
  })
}