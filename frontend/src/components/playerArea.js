import React, {useContext} from "react";


export default function PlayersArea({ players, playersList }) {
    console.log('here is the playersList', playersList);
    let playersArea
    if (players){
    playersArea = playersList.map((username, i) =>{
        return <li className="player" key={i}>{username}: {players[username].life}</li>;
        });
    }

  return (
      <ul> {playersArea} </ul>
  );
}
