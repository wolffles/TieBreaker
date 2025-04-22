 import React from "react";
import {socket} from '../utility/socket.js';
import '../style/tools.css';
import '../style/style.css';
import CoinAnimation from './coinAnimation.jsx';
import DiceAnimation from './DiceAnimation.jsx';
export default function EventModal({ showEvent, eventValue, modalType, modalRef}) {

  function flipCoin(e){
    e.preventDefault();
    socket.emit('flip coin');
  }

  function choosePlayer(e){
    e.preventDefault();
    socket.emit('choose player');
  }

  function modalRender(){
    if(modalType === 'dice') {
      return (
        <div className={`${showEvent ? "modal" : "hidden"}`} style={{ width: '60%', height: '60%'}} ref={modalRef}>
            <DiceAnimation eventResult={eventValue.result} diceType={eventValue.diceType}/>
        </div>
      );
    }else if (modalType === 'flip') {
      return (
        <div className={`${showEvent ? "column modal" : "hidden"}`} ref={modalRef}>
          <div className="coin-display">
            <CoinAnimation totalFlips={eventValue} />
          </div>
          <button className="modal-button coin" onClick={flipCoin}> Flip Coin </button>
        </div>
      );
    } else{
      return (
      <div className={`${showEvent ? "column modal" : "hidden"}`} ref={modalRef}>
        <div className="tool-display">
          <div>{eventValue}</div>    
        </div>
        <button className="modal-button chooser" onClick={choosePlayer}> Choose Player </button>
      </div>
      )
    }
  }
    return (
      <div id="modalBackground" className={`${showEvent ? "modal-background" : "hidden"}`}>
         {
            modalType === 'dice' ? modalRender() : 
            modalType === 'flip' ? modalRender() : 
            modalType === 'choose' ? modalRender() : 
            null
        }
      </div>
  );
}