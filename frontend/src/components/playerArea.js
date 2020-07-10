import React, {useContext} from "react";
import {updatePlayers, socket} from '../utility/socket.js';
import { FaTrash } from 'react-icons/fa';

export default function PlayersArea({ players, roomName, playersList, context }) {
   // console.log('here is the playersList', playersList);
    let playersArea;
  console.log('here are the players', players);
    function handleChange(e){
      e.preventDefault();
      let username = e.currentTarget.id;
      let life = e.target.value;

      let updatedPlayers = Object.assign({}, players);
  
      updatedPlayers[username].life = life;
      updatePlayers({players:updatedPlayers});

    }

    function deletePlayer(e){
      e.preventDefault();
      let username = e.currentTarget.parentElement.children[0].innerHTML;
      socket.emit('remove player', {username:username, roomName: roomName});
    }

    if (players){
      console.log('here is the players list', playersList);
    playersArea = playersList.map((username, i) =>{
        return( 
        <div className="player" id={username}  onChange={handleChange} style={{backgroundColor:players[username].color}} key={i}>
          <div className="nameHolder">
          <div className="nickname">{username}</div>
          <div className="delete" onClick={deletePlayer}><FaTrash  size="2em" /></div>
          </div>         
           <input id={username} className="life" style={{backgroundColor:players[username].color}} placeholder={players[username].life}/>         
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
