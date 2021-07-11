import { connection, server } from 'websocket';
import { SocketRouter } from './socketRouter';
import http from 'http';

const WebSocketServer = server;

class SocketRequest {
  public service: string;
  public endpoint: string;
  public params: any;

  constructor(rawData: string) {
    let obj = JSON.parse(rawData);
    this.service = obj.service;
    this.endpoint = obj.endpoint;
    this.params = obj.params;
  }
}

function createServer(port: number):Promise<http.Server> {
  const server = http.createServer((request, response) => {
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type',
    });
    response.writeHead(404);
    response.end();
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      resolve(server);
    });
  });
}

function originIsAllowed(origin:string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

export class SocketServer {
  public clients: Array<connection>
  public router: SocketRouter;

  constructor() {
    this.clients = [];
    this.router = new SocketRouter();
  }

  private messageHandler(userConnection: connection, message) {
    console.log(message);
    if (message.type === 'utf8') {
      let socketRequest = new SocketRequest(message.utf8Data);
      this.router.route(socketRequest.service, socketRequest.endpoint, userConnection, socketRequest.params);
    }
    else if (message.type === 'binary') {
      userConnection.sendBytes(message.binaryData);
    }
  }

  private closeHandler(connection: connection, reasonCode, description){
    this.clients = this.clients.filter(client => client != connection);
    this.router.closeConnection(connection);
  }

  async start(port:number){
    const server = await createServer(port);
    const wsServer = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false
    });

    wsServer.on('request', (request) => {
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        return;
      }

      const connection = request.accept(null, request.origin);
      this.clients.push(connection);
      this.router.acceptConnection(connection);
      connection.on('message', (message)=>{this.messageHandler(connection, message)});
      connection.on('close', (reasonCode, description)=>{this.closeHandler(connection, reasonCode, description)});
    });
    return true;
  }
}

export const socketServer = new SocketServer();