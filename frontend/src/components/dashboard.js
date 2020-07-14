import React, {useContext, createContext, useState, useEffect} from "react";
import PlayerArea from './playerArea.js'
import DiceModal from './diceModal.js'
import '../style/style.css';
import {updatePlayers, socket} from '../utility/socket.js';

export default function Dashboard({ context }) {
    const [userInfo, setUserInfo] = useContext(context);
    let inputContext = createContext('');
    let [inputValue, setInputContext] = useState(inputContext);

    let [showDice, setShowDice] = useState(false);
    let [diceFace, setDiceFace] = useState('');

    function changeInput(e){
      e.preventDefault();
      setInputContext(e.target.value);
    }

    function handleSubmit(e){
      e.preventDefault();
      let updatedState = Object.assign({}, userInfo);
      for (let username in updatedState.players){
        updatedState.players[username].life = inputValue;
      }
      setUserInfo(updatedState);
      updatePlayers({players:updatedState.players});
    }

    //this is the dice code
    function showDiceModal(e){    
      e.preventDefault();     
      setShowDice(!showDice);
      //this console.log is a lie? its almost like its asychonous because on click it's still false but the value is true and shows dice modal
      console.log('showDice', showDice);
      }

    function rollingDice(roll) {
      roll.forEach((face, i) => {
        setTimeout(() => {
          setDiceFace(face)
        }, i*i*10);
      });
    }

    useEffect(() => {
      socket.on('update player data', (data) =>{
          let updatedState = Object.assign({}, userInfo);
          updatedState.players = data.players;
          setUserInfo(updatedState);
      });

    socket.on('dice is rolling', roll =>{
      if(!showDice){setShowDice(true)};
      rollingDice(roll)
    });



    socket.on('update game state', (data) => {
      console.log('data in front end after change', data);
      let updatedState = Object.assign({},userInfo);
      updatedState.connectedPlayersList = data.connectedPlayersList
      updatedState.playersList = data.savedPlayersList
      updatedState.players = data.savedPlayers
      updatedState.password = data.password


      setUserInfo(updatedState)
      //sometimes updatedState is undefined? maybe asynchronous?
      if(data.broadcast){
      socket.emit('request server messages', data)
      }
    })

     
      return function cleanup() {
          socket.off('dice is rolling');
          socket.off('update player data');
          socket.off('update game state')
        };
    });
    
  

    return (
        <div className="dashboard">
          <div className="menubar">
            <form className="hp" onSubmit={handleSubmit}>
                <input type="number" maxLength="10" placeholder="Set Lifepoints" onChange={changeInput}/>
                {/* <button id="startGame">Set Lifepoints</button>   */}
            </form>
            <div className="buttons">
              <button  onClick={showDiceModal} className="button showDie"> Roll Die </button>
              <button className="button flipCoin"> Flip Coin </button>
              <button className="button chooser">Choose Player</button>
            </div>
          </div>
          <span className="roomName">Username: {userInfo.username} | Game Name: {userInfo.roomName} | Password: {userInfo.password}</span>
            <DiceModal showDice={showDice} diceFace={diceFace}/>
            <PlayerArea players={userInfo.players} roomName={userInfo.roomName} playersList={userInfo.playersList} context={context}/>
      </div>
    );
}
