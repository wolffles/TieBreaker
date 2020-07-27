import React, {useContext, useEffect} from "react";
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

      if(valueType === "score"){
        updatedPlayers[username].score = newValue;
      }else{
        updatedPlayers[username].score2 = newValue;

      }

     updatePlayers({players:updatedPlayers, noRender: true});

    }

    function adjustInputs(e, username){
      e.preventDefault();
      let updatedState = Object.assign({}, userInfo);

      updatedState.players[username].secondInput = !updatedState.players[username].secondInput

      setUserInfo(updatedState);
      updatePlayers({players:updatedState.players, noRender: true});
      
    }

    function inputs(username, secondInput, i){
      if(secondInput){

        return (
          <div className="input-holder">
            {/*  */}
            <input maxLength="4" onChange={(e) => handleChange(e, username, 'score')} className="score" style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score : 69}/>         
            <input maxLength="4" onChange={(e) => handleChange(e, username, 'score2')} className="score" style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score2 : 69}/>  
          </div>       
        );
      }else{

        return <input maxLength="4" onChange={(e) => handleChange(e, username, 'score')} className="score" style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score : 69}/>;         
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
          <div className={setClass()} id={username} style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} key={username}>
            <div className="player-area-header">
              <div className="nickname">{username}</div>
              <div className="player-area-buttons">
              <div className="add-subtract" onClick={(e) => adjustInputs(e, username)}><FaPlus  size="2em" /></div>
              <div className="add-subtract" onClick={(e) => adjustInputs(e, username)}><FaMinus  size="2em" /></div>
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
