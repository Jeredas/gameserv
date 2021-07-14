import { IChessHistory, ICrossHistory, IPublicUserInfo } from './../utilities/interfaces';
import Control from "../utilities/control";
import GenericPopup from '../genericPopup/genericPopup';
import ButtonDefault from '../buttonDefault/buttonDefault';
import recordStyles from './recordPage.module.css';
import InputWrapper from '../inputWrapper/inputWrapper';
import Cross from '../games/cross/cross';
export class Replay extends GenericPopup<string> {
    history: Array<IChessHistory> | Array<ICrossHistory>;
    replaySrceen: Control;
    popupWrapper : Control;
    gameType:string;
    params: {history : Array<IChessHistory> | Array<ICrossHistory>,gameType:string,player1:IPublicUserInfo,player2:IPublicUserInfo}
    startButton: ButtonDefault;
    closeBtn: ButtonDefault;
    speed :number;
    speedSelection: InputWrapper;
    view: Cross;
    // player1:IPublicUserInfo;
    // player2:IPublicUserInfo;
    

    constructor(parentNode:HTMLElement,params:{history : Array<IChessHistory> | Array<ICrossHistory>,gameType:string,player1:IPublicUserInfo,player2:IPublicUserInfo}){
        super(parentNode);
        this.params = params;
        this.speed = 1;
        this.startButton  = new ButtonDefault(this.popupWrapper.node,recordStyles.record_button,'replay');
        this.speedSelection = new InputWrapper(this.popupWrapper.node,
            'Enter replay speed value',
            ()=>null,'Value from 1 to 10','number');
        (this.speedSelection.field.node as HTMLInputElement).pattern = "^\d+$"
        this.speedSelection.field.node.oninput = () => {
            this.speed = Number(this.speedSelection.getValue());
        }
        this.startButton.onClick = () => {
            this.start()
        }        
        this.replaySrceen = new Control(this.popupWrapper.node, 'div', recordStyles.record_replayScreen);
        this.closeBtn = new ButtonDefault(this.popupWrapper.node,recordStyles.record_closeButton,'')
        this.closeBtn.onClick = () =>{
            this.onSelect('close')
        }
        
    }
    start(){
        this.replaySrceen.node.innerHTML = ''
        if(this.params.gameType == 'CROSS') {
            this.view = new Cross(this.replaySrceen.node);
            console.log(this.params.player1)
            this.view.playerOne.node.textContent = this.params.player1.login;
            this.view.playerTwo.node.textContent = this.params.player2.login;
            this.view.btnStart.destroy();
            this.view.btnDraw.destroy();
            this.view.btnLoss.destroy();
            (this.params.history as Array<ICrossHistory>).forEach((res:ICrossHistory,i:number)=>{
                setTimeout(()=>{
                    //const move = new Control( this.replaySrceen.node, 'div', );
                    // move.node.textContent = `${res.sign}-${res.move.x}-${res.move.y}-${res.time}`;
                    console.log(res)
                   this.view.timer.node.innerHTML = `${res.time}` 
                   const field : Array<Array<string>> = [[],[],[]];
                   field[res.move.y][res.move.x] = res.sign;
                   this.view.updateGameField(field)
                },(1000 / this.speed) * ++i);
                
            })
        }
        if (this.gameType === 'CHESS'){
            //TODO:Доделать 
            (this.params.history as Array<IChessHistory>).forEach((res:IChessHistory,i:number)=>{
                setTimeout(()=>{
                    const move = new Control(this.replaySrceen.node, 'div', );
                    move.node.textContent = `${res.figName}-${res.coords}-${res.coords}-${res.time}`;
                },(1000 / this.speed) * ++i)
                
            })
        }
        
    }
}
