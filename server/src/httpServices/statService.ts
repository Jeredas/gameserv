import { IChessHistory } from '../socketServices/games/chessGameChannel';
import { Router } from './httpRouter';
import DefaultResponse from './defaultResponse';
import StatModel from '../dataModels/statisticModel';
class StatResponse {
  session: string;
  gameData: {
    gameType:string,
    date:string,
    player1: string,
    player2: string,
    winner:string,
    time:string,
    history: [],
    moves : Array<{ field: string; player: string; history: IChessHistory}>;
}

  constructor(statistic: StatModel) {
    this.gameData = {
      gameType:statistic.gameType,
      date:statistic.date,
      player1: statistic.player1,
      player2: statistic.player2,
      winner:statistic.winner,
      time:statistic.time,
      history:statistic.history,
      moves : statistic.moves
    }
  }
}

export async function writeStatistic(params) {
  try {
    const statistic = await StatModel.buildStatistics(params);
    const response = new StatResponse(statistic)
    return new DefaultResponse(true,response);
  } catch(err) {
    return new DefaultResponse(false,err)
  }
  
}
async function getStatistic() {
  try {
  const statistic = await StatModel.getStatistics()
  return new DefaultResponse(true,statistic);
  } catch(err) {
    return new DefaultResponse(false,err);
  }
  
}


class StatService {
  private router: Router;
  private serviceName: string = 'statService';

  async start(router: Router) {
    this.router = router;
    this.addEndpoint('getStatistic', getStatistic);
    this.addEndpoint('writeStatistic', writeStatistic);
    return true;
  }

  addEndpoint(name, func) {
    this.router.addRoute(this.serviceName + '/' + name, func);
  }
}

export const statService = new StatService();


