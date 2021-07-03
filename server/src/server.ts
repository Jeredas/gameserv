import { httpServer } from './httpServer';
import {decodeBase64, encodeBase64} from './utils/base64'

httpServer.start();
console.log('Web server');
