
import Signal from '../../socketClient/signal';
import httpUrl  from '../utilities/apiConfig';
import {IUserAuth} from '../utilities/interfaces';
import { apiPostRequest, apiRequest } from '../utilities/utils';


const apiUrl = `${httpUrl}/statService/`;

export class RecordModel {
  // onResult: Signal<string> = new Signal();
  // public onLogIn: Signal<IUserAuth> = new Signal();

  constructor() {

  }

  async getStatistic() {
    const response = await apiRequest(apiUrl, 'getStatistic', {}).then((res) => {
        const recordData = res.data
        return recordData
    }).catch((err)=>{
      return {status:`${err}`}
    });
    return response
  }
  async writeStatistic(gameData: {
    gameName: string,
    time: string,
    winner : string,
    history : [],
  }) {
    const request = await apiPostRequest(apiUrl, 'writeStatistic', gameData).then(res => {
      return res
    });
    return request

  }

 


}
