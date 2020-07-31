import React, {useState} from "react";
import {updatePlayers, socket} from '../utility/socket.js';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { getUsernameColor } from "../utility/playerMisc.js";

export default function PlayersArea({ players, roomName, playersList }) {
   const [localPlayers, setLocalPlayers] = useState(players);

    let playersArea;
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
        updatedPlayers[username].points.push(['Input title...','0'])
      }else if (action === 'minus' && updatedPlayers[username].points.length > 1) {
        updatedPlayers[username].points.pop()
      } else{
        return
      }
      console.log('here are the updated players', updatedPlayers);
      setLocalPlayers(updatedPlayers);
      updatePlayers({players:updatedPlayers, actions:'setPoints', noRender: true});
      
    }

    function deletePlayer(e, username){
      e.preventDefault();
      socket.emit('remove player', {username:username, roomName: roomName});
    }

    function setPlayerClass(){
      if(playersList.length <= 6){
        return "player";
      } else{
        return "player2"
      }
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

    function setPointsClass(){
      if(playersList.length <= 2){
        return "points points-font-large";
      } else if (playersList.length <=6){ 
        return "points points-font-medium"
      } else{
        return "points points-font-small"
      }
    }

    function setPointsTitleFont() {
      if(playersList.length <= 2){
        return "points-title points-title-font-large";
      } else {
        return "points-title points-title-font-medium"
      }
    }

    function setPlayerAreaClass(){
      if(playersList && playersList.length < 7){
        return "playerArea"
      } else {
        return "playerArea playerAreaSpacing"
      }
    }
    

    if (players){
    playersArea = playersList.map((username, i) =>{

      let player = players[username];

      let inputsArea = player.points.map((point,i) =>{
        return (
        <div key={i}>
          <input 
            className={setPointsTitleFont()} 
            onChange={(e) => handleChange(e, username, i, 'title')} 
            style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} 
            placeholder={player ? point[0] : "Input title..."}
          />
          <input 
            className={setPointsClass()} 
            maxLength="4" 
            onChange={(e) => handleChange(e, username, i, 'points')} 
            style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} 
            placeholder={point[1]}
          />    
        </div>
        );   

      });

   

        return( 
          <div className={setPlayerClass()} id={username} style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} key={username}>
            <div className="player-area-header">
              <div className="nickname">{username}</div>
              <div className="player-area-buttons">
              <div className={player.points.length >= 4 ? "no-press" : "add-subtract"} onClick={(e) => adjustInputs(e, username, 'plus')}><FaPlus  size="2em" /></div>
              <div className={player.points.length <= 1 ? "no-press" : "add-subtract"} onClick={(e) => adjustInputs(e, username, 'minus')}><FaMinus  size="2em" /></div>
              <div className="delete" onClick={(e) => deletePlayer(e, username)}><FaTrash  size="2em" /></div>
              </div>
            </div>
            <div className={setPlayerBodyClass()}>
              {inputsArea}
            </div>
          </div>
          );
        });
    }

  return (
    <div className={setPlayerAreaClass()}>
          {playersArea}        
    </div>
  );
}
