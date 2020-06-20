import React, {useContext} from "react";
import {updatePlayers, socket} from '../utility/socket.js';

export default function PlayersArea({ players, playersList, context }) {
   // console.log('here is the playersList', playersList);
    let playersArea;

    function handleChange(e){
      e.preventDefault();
      let username = e.currentTarget.children[0].innerHTML;
      let life = e.target.value;

      let updatedPlayers = Object.assign({}, players);
      updatedPlayers[username].life = life;
      updatePlayers({players:updatedPlayers});

    }

    if (players){
    playersArea = playersList.map((username, i) =>{
        return( 
        <div className="player" onChange={handleChange} style={{backgroundColor:players[username].color}} key={i}>
          <div className="nickname">{username}</div>
          <input className="life" style={{backgroundColor:players[username].color}} placeholder={players[username].life}/>         
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
