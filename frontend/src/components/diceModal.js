import React, {useState, useEffect} from "react";
import {sendMessage, socket} from '../utility/socket.js';
import '../style/tools.css';
import '../style/style.css';
export default function DiceModal({ context, showDice, diceFace, }) {
  function rollDice(e){
    e.preventDefault();
    let diceType = e.target.innerHTML
    socket.emit('roll dice', diceType);
  }

  useEffect(() =>{
    return function cleanup(){
    }
  });

    return (
      <div className={`${showDice ? "modal" : "hidden"}`}>
        <div className="dice divider outside">
          <button className="button dice" onClick={rollDice}> 4 </button>
          <button className="button dice" onClick={rollDice}> 6 </button>
          <button className="button dice" onClick={rollDice}> 8 </button>
        </div>
        <div className="dice divider middle">
          {diceFace}
        </div>
        <div className="dice divider outside">
          <button className="button dice" onClick={rollDice}> 10 </button>
          <button className="button dice" onClick={rollDice}> 12 </button>
          <button className="button dice" onClick={rollDice}> 20 </button>
        </div>
      </div>
  );
}