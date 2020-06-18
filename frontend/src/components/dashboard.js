import React, {useContext} from "react";
import PlayerArea from './playerArea.js'
import '../style/style.css';

export default function Dashboard({ context }) {
    const [userInfo, setUserInfo] = useContext(context);

    
  

    return (
        <div className="dashboard">
          <div className="menubar">
            <form>
                <input id="hp" type="number" maxLength="10" placeholder="lifepoints" />
                <button hidden id="startGame"></button>  
            </form>
            <button id="showDie">Show Die</button>
          </div>
          <div className="playerArea">
            <PlayerArea players={userInfo.players} playersList={userInfo.playersList} />
          </div>
      </div>
    );
}
