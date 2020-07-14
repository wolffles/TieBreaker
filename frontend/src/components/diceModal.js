import React, {useState, useEffect} from "react";
import {sendMessage, socket} from '../utility/socket.js';

export default function DiceModal({ context, showDice, setShowDice }) {

  let [diceModal, setDiceModal] = useState('');

  

  let dice;

  function rollDice(e){
    e.preventDefault();
    let diceType = e.target.innerHTML
    let roll = diceToss(diceType);
    console.log(diceType)
    console.log(roll);
    // for(let i = 0; roll.length > i; i++){
    //   setTimeout(() => {
    //     console.log('this is the index', i)
    //     setDiceModal(roll[i])
    //   }, i*750);
    // }
    // roll.forEach((face, i) => {
    //   setTimeout(() => {
    //     console.log('this is the index', i)
    //     setDiceModal(face)
    //   }, i*i*10);

      socket.emit('roll dice', roll);
    


    // let i = 0
   
    // while (i < roll.length){
    //   setTimeout(() => {
    //     console.log('this is the index', i)
    //     setDiceModal(roll[i])
    //   }, i*1000);
    //   console.log('hit',i)
    //   i++
    // }
     // setTimeout(() => {
    //   setDiceModal(roll[i])
    //   console.log('this is the index', i)
    // }, 2000);
    // setTimeout(() => {
    //   setDiceModal(roll[5])
    //   console.log('this is the index', 5)
    // }, 5000);
  } 
  
  function rollingDice(roll) {
      
    roll.forEach((face, i) => {
      setTimeout(() => {
        console.log('this is the index', i)
        setDiceModal(face)
      }, i*i*10);

  });
}

  function diceToss(sides) {
    let array = [];
    while (array.length < 13){
      let num = Math.floor(Math.random() * sides) + 1
      array.push(num)
    }
    return array
  }

  useEffect(() =>{

    socket.on('dice is rolling', roll =>{
      rollingDice(roll);
    });

    return function cleanup(){
      socket.off('dice is rolling');
    }
  });

    return (
      <div className={`modal ${showDice ? "" : "hidden"}`}>
        <button className="button dice" onClick={rollDice}> 4 </button>
        <button className="button dice" onClick={rollDice}> 6 </button>
        <button className="button dice" onClick={rollDice}> 8 </button>
        <button className="button dice" onClick={rollDice}> 10 </button>
        <button className="button dice" onClick={rollDice}> 12 </button>
        <button className="button dice" onClick={rollDice}> 20 </button>
        <h1>{diceModal}</h1>
      </div>
  );
}