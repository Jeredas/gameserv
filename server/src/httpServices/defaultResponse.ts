export default class DefaultResponse{
  status:string;
  data: any;

  constructor(isSuccess:boolean, data:any=null){
    this.status = isSuccess ? 'ok' : 'error';
    this.data = data;
  }
}