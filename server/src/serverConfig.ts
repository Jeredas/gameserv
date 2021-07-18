export const serverConfig = {
  cloudnodeDatabaseURL: '',
  //localDatabaseURL: 'mongodb://localhost:27017',
  localDatabaseURL: 'mongodb://Jeredas:LWH8QoZN6r@mongodb.cloudno.de:27017/jeredasdb',
  httpServerPort: Number.parseInt(process.env.app_port) || 4040,
  socketServerPort: Number.parseInt(process.env.app_port) || 4080
}