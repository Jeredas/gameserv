import { databaseService } from '../databaseService';
import IChessHistory from '../socketServices/games/chessGameChannel/chessSupport/chessInterfaces';
const collectionName = 'games'

export default class StatModel {
  gameType: string
  date: string
  player1: string
  player2: string
  winner: string
  time: string
  history: []
  gameMode:string
  field: string[]
  moves: { field: string; player: string; history: IChessHistory; }[];

  constructor(gameDto) {
    if (!gameDto) {
      throw new Error("User dto invalid.");
    }
    this.gameType = gameDto.gameType;
    this.time = gameDto.time;
    this.winner = gameDto.winner;
    this.history = gameDto.history;
    this.date = gameDto.date;
    this.player1 = gameDto.player1;
    this.player2 = gameDto.player2;
    this.gameMode = gameDto.gameMode;
    this.moves = gameDto.moves;
  }

  static async buildStatistics(params:StatModel): Promise<StatModel> {
    var gameDto = {
      gameType: params.gameType,
      time: params.time,
      winner: params.winner,
      history: params.history,
      date: params.date,
      player1: params.player1,
      player2: params.player2,
      gameMode:params.gameMode,
      moves:params.moves
    };

    await databaseService.db.collection(collectionName).insertOne(gameDto);
    return new StatModel(gameDto);
  }

  static async getStatistics() {
    const statistic : Array<StatModel> = await databaseService.db.collection(collectionName).find().toArray()
    return statistic
  }



}