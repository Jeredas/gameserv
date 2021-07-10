import {LobbyService} from './lobbyService'; 
import { connection} from 'websocket';

export class SocketRouter {
  public services:any;

  constructor() {
    this.services = { chat: new LobbyService() };
  }

  route(serviceName, endpointName, connection, params) {
    if (endpointName && endpointName[0]!== '_'){
      this.services[serviceName][endpointName](connection, params);
    }
  }

  closeConnection(userConnection:connection) {
    Object.keys(this.services).forEach(it => {
      this.services[it].closeConnection(userConnection);
    })
  }
}
