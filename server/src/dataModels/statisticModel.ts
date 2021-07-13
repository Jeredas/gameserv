import { databaseService } from '../databaseService';
const collectionName = 'games'

export default class StatModel {
  gameType: string
  date: string
  player1: string
  player2: string
  winner: string
  time: string
  history: []

  constructor(userDto) {
    if (!userDto) {
      throw new Error("User dto invalid.");
    }
    this.gameType = userDto.gameType;
    this.time = userDto.time;
    this.winner = userDto.winner;
    this.history = userDto.history;
    this.date = userDto.date;
    this.player1 = userDto.player1;
    this.player2 = userDto.player2
  }

  static async buildStatistics(gameType: string, time: string, winner: string, history: [] | string, player1: string, player2: string, date: string): Promise<StatModel> {
    var gameDto = {
      gameType: gameType,
      time: time,
      winner: winner,
      history: history,
      date: date,
      player1: player1,
      player2: player2
    };

    await databaseService.db.collection(collectionName).insertOne(gameDto);
    return new StatModel(gameDto);
  }

  static buildByGameName(gameName: string) {
    const statistic = databaseService.db.collection(collectionName).find()
    return statistic
  }



}