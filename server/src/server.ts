import { httpServer } from './httpServices/httpServer';
import {decodeBase64, encodeBase64} from './utils/base64'
import {databaseService} from './databaseService';
import {serverConfig} from './serverConfig';

databaseService.start(serverConfig.localDatabaseURL).then(isDBStarted=>{
  if (isDBStarted){
    return httpServer.start(serverConfig.httpServerPort);
  } else {
    throw new Error("DB start error.");
  }
}).then(isServerStarted=>{
  if (isServerStarted) {
    console.log(`Server is started on http://localhost:${serverConfig.httpServerPort}`);
  } else {
    throw new Error("Server start error.");
  }
});

console.log('Web server index file completed.');
