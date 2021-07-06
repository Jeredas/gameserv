import { httpServer } from './httpServices/httpServer';
import {decodeBase64, encodeBase64} from './utils/base64'
import {databaseService} from './databaseService';
import {serverConfig} from './serverConfig';
import {socketServer} from './socketServices/socketServer';

databaseService.start(serverConfig.localDatabaseURL).then(isDBStarted=>{
  if (isDBStarted){
    return httpServer.start(serverConfig.httpServerPort);
  } else {
    throw new Error("DB start error.");
  }
}).then(isServerStarted=>{
  if (isServerStarted) {
    console.log(`Server is started on http://localhost:${serverConfig.httpServerPort}`);
    return socketServer.start(serverConfig.socketServerPort);
  } else {
    throw new Error("Server start error.");
  }
}).then(isSocketServerStarted=>{
  if (isSocketServerStarted) {
    console.log(`Socket server is started on ws://localhost:${serverConfig.socketServerPort}.`);
  } else {
    throw new Error("Socket server start error.");
  }
});

console.log('Web server index file completed.');
