import React, {useContext, userState, createContext, useEffect, useState} from "react";
import {updatePlayers, socket} from '../utility/socket.js';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { getUsernameColor } from "../utility/playerMisc.js";

export default function PlayersArea({ context, players, roomName, playersList }) {
   const [userInfo, setUserInfo] = useContext(context);

   const [localPlayers, setLocalPlayers] = useState(players);

    let playersArea;
    function handleChange(e, username, index, changeType){
      e.preventDefault();

      let newValue = e.target.value;
      let updatedPlayers = Object.assign({}, localPlayers);

      if(changeType == "points"){
        updatedPlayers[username].points[index][1] = newValue;
      } else{
        updatedPlayers[username].points[index][0] = newValue;

      }

     updatePlayers({players:updatedPlayers, action:'setPoints', noRender: true});

    }

    function adjustInputs(e, username, action){
      e.preventDefault();
      let updatedPlayers = Object.assign({}, localPlayers);

      if(action == 'plus' && updatedPlayers[username].points.length < 4){
        updatedPlayers[username].points.push(['Input title...','0'])
      }else if (action == 'minus' && updatedPlayers[username].points.length > 1) {
        updatedPlayers[username].points.pop()
      } else{
        return
      }

      setLocalPlayers(updatedPlayers);
      updatePlayers({players:updatedPlayers, noRender: true});
      
    }

    function deletePlayer(e, username){
      e.preventDefault();
      socket.emit('remove player', {username:username, roomName: roomName});
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

      let player = players[username];

      let inputsArea = player.points.map((point,i) =>{
        return (
        <div key={i}>
          <input 
            className="points-title" placeholder="Input title..." 
            onChange={(e) => handleChange(e, username, i, 'title')} 
            style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} 
            placeholder={player ? point[0] : "Input title..."}
          />
          <input 
            className="points" 
            maxLength="4" 
            onChange={(e) => handleChange(e, username, i, 'points')} 
            style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} 
            placeholder={players[username] ? point[1] : 0} 
          />    
        </div>
        );   

      });

        return( 
          <div className={setClass()} id={username} style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} key={username}>
            <div className="player-area-header">
              <div className="nickname">{username}</div>
              <div className="player-area-buttons">
              <div className={player.points.length >= 4 ? "no-press" : "add-subtract"} onClick={(e) => adjustInputs(e, username, 'plus')}><FaPlus  size="2em" /></div>
              <div className={player.points.length <= 1 ? "no-press" : "add-subtract"} onClick={(e) => adjustInputs(e, username, 'minus')}><FaMinus  size="2em" /></div>
              <div className="delete" onClick={(e) => deletePlayer(e, username)}><FaTrash  size="2em" /></div>
              </div>
            </div>
            <div className="player-area-body">
              {inputsArea}
            </div>
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
