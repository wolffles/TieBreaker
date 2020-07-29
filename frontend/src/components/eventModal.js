 import React from "react";
import {socket} from '../utility/socket.js';
import '../style/tools.css';
import '../style/style.css';
export default function DiceModal({ context, showEvent, eventValue, modalType}) {


  function rollDice(e){
    e.preventDefault();
    let diceType = e.target.innerHTML
    socket.emit('roll dice', diceType);
  }

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
        <div className={`${showEvent ? "modal" : "hidden"}`}>
        <div className="dice divider outside">
          <button className="modal-button dice" onClick={rollDice}> 4 </button>
          <button className="modal-button dice" onClick={rollDice}> 6 </button>
          <button className="modal-button dice" onClick={rollDice}> 8 </button>
        </div>
        <div className="dice divider middle">
          {eventValue}
        </div>
        <div className="dice divider outside">
          <button className="modal-button dice" onClick={rollDice}> 10 </button>
          <button className="modal-button dice" onClick={rollDice}> 12 </button>
          <button className="modal-button dice" onClick={rollDice}> 20 </button>
        </div>
      </div>
      );
    }else if (modalType === 'flip') {
      return (<div className={`${showEvent ? "column modal" : "hidden"}`}>
                    <div className="tool-display">
                     <div>{eventValue}</div>    
                    </div>
                    <button className="modal-button coin" onClick={flipCoin}> Flip Coin </button>
              </div>);
    } else{
      return (<div className={`${showEvent ? "column modal" : "hidden"}`}>
      <div className="tool-display">
       <div>{eventValue}</div>    
      </div>
      <button className="modal-button chooser" onClick={choosePlayer}> Choose Player </button>

</div>);
    }
  }
    return (
      <div id="modalBackground" className={`${showEvent ? "modal-background" : "hidden"}`}>{modalRender()}</div>
  );
}