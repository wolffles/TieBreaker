import React, {useContext, createContext, useState, useEffect} from "react";
import PlayerArea from './playerArea.js'
import DiceModal from './diceModal.js'
import '../style/style.css';
import {updatePlayers, socket} from '../utility/socket.js';

export default function Dashboard({ context }) {
    const [userInfo, setUserInfo] = useContext(context);
    let inputContext = createContext('');
    let [inputValue, setInputContext] = useState(inputContext);

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


    useEffect(() => {
      socket.on('update player data', (data) =>{
          let updatedState = Object.assign({}, userInfo);
          updatedState.players = data.players;
          setUserInfo(updatedState);
      });


    // socket.on('update player state', (data) => {
    //   let updatedState = Object.assign({},userInfo);
    //   updatedState.username = data.username
    //   updatedState.life = data.life
    //   updatedState.id = data.id
    //   updatedState.color = data.color
    //   console.log(updatedState)
    //   setUserInfo(updatedState);
    // })

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
         socket.off('update player data');
         socket.off('update player state');
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
              <button className="button showDie"> Roll Die </button>
              <button className="button flipCoin"> Flip Coin </button>
              <button className="button chooser">Choose Player</button>
            </div>
          </div>
          <span className="roomName">Username: {userInfo.username} | Game Name: {userInfo.roomName} | Password: {userInfo.password}</span>
            <DiceModal/>
            <PlayerArea players={userInfo.players} roomName={userInfo.roomName} playersList={userInfo.playersList} context={context}/>
      </div>
    );
}
