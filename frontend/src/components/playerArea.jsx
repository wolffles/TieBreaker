import React, {useState, useEffect} from "react";
import {updatePlayers, socket} from '../utility/socket.js';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { getUsernameColor } from "../utility/playerMisc.js";

export default function PlayersArea({ players, roomName, playersList }) {
   const [localPlayers, setLocalPlayers] = useState({});
    function handleChange(e, username, index, changeType){
      e.preventDefault();

      let newValue = e.target.value;
      let updatedPlayers = Object.assign({}, localPlayers);

      if(changeType === "points"){
        updatedPlayers[username].points[index][1] = newValue;
      } else{
        updatedPlayers[username].points[index][0] = newValue;

      }

     updatePlayers({players:updatedPlayers, action:'setPoints', noRender: true});

    }

    function adjustInputs(e, username, action){
      e.preventDefault();
      let updatedPlayers = Object.assign({}, localPlayers);
      if(action === 'plus' && updatedPlayers[username].points.length < 4){
        updatedPlayers[username].points = [...updatedPlayers[username].points,['Input title...','0']]
      }else if (action === 'minus' && updatedPlayers[username].points.length > 1) {
        updatedPlayers[username].points.pop()
      } else{
        return
      }
      setLocalPlayers(updatedPlayers);
      updatePlayers({players:updatedPlayers, action: 'setPoints', noRender: true});
      
    }

    function deletePlayer(e, username){
      e.preventDefault();
      socket.emit('remove player', {username:username, roomName: roomName});
    }

    function setPlayerBodyClass(){
      if(playersList.length <= 2){
        return "player-area-body";
      } else if (playersList.length <=6) {
        return "player-area-body2"
      }else {
        return "player-area-body3"
      }
    }

  


    useEffect(() => {
      setLocalPlayers(players) 
    }, [players, playersList])

    return (
      <div className="playerArea">
        {localPlayers && playersList.map((username, i) =>{ 
          return (
            <div
              className="player-box"
              id={username}
              style={{
                backgroundColor:players[username] ? players[username].color : getUsernameColor(username),
                boxShadow: "rgba(0, 0, 0, 0.3) 0px 3px 7px -3px, rgba(0, 0, 0, 0.25) 0px 6px 12px -2px"
              }}
              key={username}
            >
              <div className="player-box-header">
                <div className="nickname">{username}</div>
                <div className="player-box-buttons" style={{fontSize: "12px"}}>
                <div className={players[username].points.length >= 4 ? "no-press add-subtract" : "add-subtract"} onClick={(e) => adjustInputs(e, username, 'plus')}><FaPlus  size="2em" /></div>
                <div className={players[username].points.length <= 1 ? "no-press add-subtract" : "add-subtract"} onClick={(e) => adjustInputs(e, username, 'minus')}><FaMinus  size="2em" /></div>
                <div className="delete" onClick={(e) => deletePlayer(e, username)}><FaTrash  size="2em" /></div>
                </div>
              </div>
              <div className="player-box-body">
                {localPlayers && players[username].points.map((point,i) =>{
                  return (
                  <div key={i} className="points-box">
                    <input 
                      className="points-title" 
                      onChange={(e) => handleChange(e, username, i, 'title')} 
                      style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} 
                      placeholder={players[username] ? point[0] : "Input title..."}
                    />
                    <input 
                      className="points-input"
                      maxLength="4" 
                      onChange={(e) => handleChange(e, username, i, 'points')} 
                      style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} 
                      placeholder={point[1]}
                    />    
                  </div>
                  )
                })}
          </div>
        </div>   
      )
      })}
    </div>
  );
}
