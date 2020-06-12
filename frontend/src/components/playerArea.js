import React, {useContext} from "react";


export default function PlayersArea({ players, playersList }) {
    let playersArea
    if (players){
    playersArea = playersList.map((username, i) =>{
        return <li className="playerArea" key={i}>{username}: {players[username].life}</li>;
        });
    }

  return (
      <ul> {playersArea} </ul>
  );
}
