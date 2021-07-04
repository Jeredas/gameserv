import { databaseService } from '../databaseService';
const collectionName = 'sessions'

function generateSessionHash(login:string) {
  return login + (Math.random() * 1000).toFixed(0);
}

export default class SessionModel{
  login: string;
  session: string;

  constructor(sessionDto){
    if (!sessionDto){
      throw new Error("User dto invalid.");
    }
    this.login = sessionDto.login;
    this.session = sessionDto.session;
  }

  static async buildNewSession(login:string):Promise<SessionModel>{
    var sessionDto = {
      login: login,
      session: generateSessionHash(login)
    };
    await databaseService.db.collection('sessions').insertOne(sessionDto);
    return SessionModel.buildByLogin(login);
  }

  static async buildByLogin(login:string):Promise<SessionModel>{
    return databaseService.db.collection(collectionName).findOne({login: login}).then(sessionDto=>{
      return new SessionModel(sessionDto);
    })
  }

  static async buildBySessionHash(sessionHash:string):Promise<SessionModel>{
    return databaseService.db.collection(collectionName).findOne({session: sessionHash}).then(sessionDto=>{
      return new SessionModel(sessionDto);
    })
  }

}