import {Db, MongoClient} from 'mongodb';

export class DatabaseService{
  public db: Db;

  constructor(){
    this.db = null;
  }

  start(url){
    let mongo = new MongoClient(url, {
      useNewUrlParser:true, 
      useUnifiedTopology:true
    });

    mongo.connect().then(()=>{
      this.db = mongo.db('chessmate');
      console.log('Connected to database.');
    });
  }
}

export const databaseService = new DatabaseService();