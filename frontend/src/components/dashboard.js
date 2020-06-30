import React, {useContext, createContext, useState, useEffect} from "react";
import PlayerArea from './playerArea.js'
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

     
      return function cleanup() {
         socket.off('update player data');
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
            <PlayerArea players={userInfo.players} playersList={userInfo.playersList} context={context}/>
      </div>
    );
}
