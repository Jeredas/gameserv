import { databaseService } from '../databaseService';
const collectionName = 'users'

export default class UserModel{
  login: string;
  name: string
  password: string;
  avatar: string;

  constructor(userDto){
    if (!userDto){
      throw new Error("User dto invalid.");
    }
    this.login = userDto.login;
    this.password = userDto.password;
    this.avatar = userDto.avatar;
    this.name = userDto.name;
  }

  static async buildNewUser(login:string, password:string, avatar:string = '', name:string = ''):Promise<UserModel>{
    var userDto = {
      login: login,
      password: password,
      avatar: avatar,
      name: name
    };
    await databaseService.db.collection(collectionName).insertOne(userDto);
    return UserModel.buildByLogin(login);
  }

  static async buildByLogin(login:string){
    return databaseService.db.collection(collectionName).findOne({login: login}).then(userDto=>{
      return new UserModel(userDto);
    })
  }

  static async buildByCreds(login:string, password:string){
    console.log(login ,password)
    return databaseService.db.collection(collectionName).findOne({login: login, password:password}).then(userDto=>{
      console.log(userDto);
      return new UserModel(userDto);
    })
  }

}