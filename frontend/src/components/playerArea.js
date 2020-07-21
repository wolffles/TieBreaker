import React, {useContext, useState} from "react";
import {updatePlayers, socket} from '../utility/socket.js';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { getUsernameColor } from "../utility/playerMisc.js";

export default function PlayersArea({ context, players, roomName, playersList }) {
   // console.log('here is the playersList', playersList);
   const [userInfo, setUserInfo] = useContext(context);

    let playersArea;
    console.log('here are the players', )
  // console.log('here are the players', players);

    function handleChange(e){
      e.preventDefault();
      let username = e.currentTarget.id;
      let newValue = e.target.value

      let updatedPlayers = Object.assign({}, players);
      if(e.target.id == "score"){
        updatedPlayers[username].score = newValue;
      }else{
        updatedPlayers[username].score2 = newValue;

      }
      updatePlayers({players:updatedPlayers});

    }

    function adjustInputs(e, username){
      e.preventDefault();

      let updatedState = Object.assign({}, userInfo);
      console.log('here is the updated state', updatedState);
      console.log('here is the given username', username)
      updatedState.players[username].secondInput = !updatedState.players[username].secondInput

      setUserInfo(updatedState);
      updatePlayers({players:updatedState.players});
      
    }

    function inputs(username, secondInput){
      if(secondInput){
        return (
          <div className="input-holder">
            <input id="score" className={`${username} life`} style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score : 0}/>         
            <input id="score2" className={`${username} life`} style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score2 : 0}/>  
          </div>       
        );
      }else{
        return <input id="score" className={`${username} life`} style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} placeholder={players[username] ? players[username].score : 0}/>;         
      }
    }

    function deletePlayer(e){
      e.preventDefault();
      let username = e.currentTarget.parentElement.children[0].innerHTML;
      socket.emit('remove player', {username:username, roomName: roomName});
    }

    function addButtonRender(username, secondInput){
      if(secondInput){
        return <div className="add-subtract" onClick={(e) => adjustInputs(e, username)}><FaMinus  size="2em" /></div>;

      }else{
        return <div className="add-subtract" onClick={(e) => adjustInputs(e, username)}><FaPlus  size="2em" /></div>;

      }
    }

    if (players){
    playersArea = playersList.map((username, i) =>{
        return( 
          <div className="player" id={username}  onChange={handleChange} style={{backgroundColor:players[username] ? players[username].color : getUsernameColor(username)}} key={i}>
            <div className="player-area-header">
              <div className="nickname">{username}</div>
              <div className="player-area-buttons">
                {addButtonRender(username, players[username].secondInput)}
                <div className="delete" onClick={deletePlayer}><FaTrash  size="2em" /></div>
              </div>
            </div>   
            {inputs(username, players[username].secondInput)}      
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
