import React, {useContext} from "react";
import {updatePlayers, socket} from '../utility/socket.js';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { getUsernameColor } from "../utility/playerMisc.js";

export default function PlayersArea({ context, players, roomName, playersList }) {
   // console.log('here is the playersList', playersList);
   const [userInfo, setUserInfo] = useContext(context);

    let playersArea;
  // console.log('here are the players', players);

    function handleChange(e, username, valueType){
      e.preventDefault();

      let newValue = e.target.value;
  
      let updatedPlayers = Object.assign({}, players);

      if(valueType == "score"){
        updatedPlayers[username].score = newValue;
      }else{
        updatedPlayers[username].score2 = newValue;

      }
    
      updatePlayers({players:updatedPlayers});

    }

    function adjustInputs(e, username){
      e.preventDefault();
      console.log('pressed input button',  `${new Date().getMinutes()}` + ":" + `${new Date().getSeconds()}` + ":"  + `${new Date().getMilliseconds()}`);

      let updatedState = Object.assign({}, userInfo);
      //console.log('here is the updated state', updatedState);
     // console.log('here is the given username', username)
      updatedState.players[username].secondInput = !updatedState.players[username].secondInput

     // setUserInfo(updatedState);
      updatePlayers({players:updatedState.players});
      
    }

    function inputs(username, secondInput, i){
      if(secondInput){
        console.log('moving to second input',  `${new Date().getMinutes()}` + ":" + `${new Date().getSeconds()}` + ":"  + `${new Date().getMilliseconds()}`);

        return (
          <div className="input-holder">
            {/*  */}
            <input onChange={(e) => handleChange(e, username, 'score')}  maxLength="4" className="score" style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score : 69}/>         
            <input onChange={(e) => handleChange(e, username, 'score2')} maxLength="4" className="score" style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score2 : 69}/>  
          </div>       
        );
      }else{
        console.log('moving to one input',  `${new Date().getMinutes()}` + ":" + `${new Date().getSeconds()}` + ":"  + `${new Date().getMilliseconds()}`);

        return <input onChange={(e) => handleChange(e, username, 'score')} maxength="4" className="score" style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score : 69}/>;         
      }
    }

    function deletePlayer(e, username){
      e.preventDefault();
      socket.emit('remove player', {username:username, roomName: roomName});
    }

    function addButtonRender(username, secondInput){
      if(secondInput){
        return <div className="add-subtract" onClick={(e) => adjustInputs(e, username)}><FaMinus  size="2em" /></div>;

      }else{
        return <div className="add-subtract" onClick={(e) => adjustInputs(e, username)}><FaPlus  size="2em" /></div>;

      }
    }

    function setClass(){
      if(playersList.length <= 6){
        return "player";
      } else{
        return "player2"
      }
    }

    if (players){
    playersArea = playersList.map((username, i) =>{
        return( 
          <div className={setClass()} id={username} style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} key={i}>
            <div className="player-area-header">
              <div className="nickname">{username}</div>
              <div className="player-area-buttons">
                {addButtonRender(username, players[username].secondInput)}
                <div className="delete" onClick={(e) => deletePlayer(e, username)}><FaTrash  size="2em" /></div>
              </div>
            </div>   
            {inputs(username, players[username].secondInput, i)}      
          </div>
          );
        });
    }

  return (
    <div className="playerArea">
          {playersArea}        
    </div>
  );
}
