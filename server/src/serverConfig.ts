export const serverConfig = {
  cloudnodeDatabaseURL: '',
  localDatabaseURL: 'mongodb://localhost:27017',
  // localDatabaseURL: 'mongodb://sharkellgm:EC276z6lbf@mongodb.cloudno.de:27017/chessmate',
  httpServerPort: Number.parseInt(process.env.app_port) || 4040,
  socketServerPort: Number.parseInt(process.env.app_port) || 4080
}