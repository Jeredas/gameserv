const http = require('http');
/*const config = require('./serverConfig');
const util = require('util');

//const router = require('./router');
const echoService = require('./services/echoService');
const testService = require('./services/testService');
const todoListService = require('./services/todoList/todoListService');*/
import {authService} from './httpServices/authService';

const app_port = process.env.app_port || 4040;
const app_host = process.env.app_host || '127.0.0.1';

//const {databaseService} = require('./dbService');

import {router} from './httpRouter';
authService.start(router);
function paramsParser(paramsString:string):any {
  let params = {};
  paramsString.split(/[&]+/).forEach((it) => {
    let entry = it.split('=');
    params[entry[0]] = entry[1];
  });
  return params;
}

class Server {
  constructor() {}

  response(res, val) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
    });

    res.write(val);
    res.end();
  }

  start() {
    http.createServer(async (req, res) => {
        let entry = req.url.split('?');
        let route = entry[0].slice(1);
        let params = paramsParser(entry[1] || '');
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
      })
      .listen(app_port);
  }
}

export const httpServer = new Server();