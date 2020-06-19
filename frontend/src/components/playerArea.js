import React, {useContext} from "react";


export default function PlayersArea({ players, playersList }) {
   // console.log('here is the playersList', playersList);
    let playersArea
    if (players){
    playersArea = playersList.map((username, i) =>{
        return <div className="player" style={{backgroundColor:players[username].color}} key={i}>{username}: {players[username].life}</div>;
        });
    }

  return (
    <div className="playerArea"> 
      {playersArea} 
    </div>
  );
}
