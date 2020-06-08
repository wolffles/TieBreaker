import React, {useContext} from "react";


export default function Dashboard({ context }) {
    //const [userInfo, setUserInfo] = useContext(context);

  

    return (
        <div className="dashboard">
        <div className="menubar">
            <form>
                <input id="hp" type="number" maxLength="10" placeholder="lifepoints" />
                <button hidden id="startGame"></button>  
            </form>
            
            <button id="showDie">Show Die</button>
        </div>
        <div id="playerArea">

        </div>
            {/* <!-- The Modal --> */}
            <div id="myModal" className="modal">

            {/* <!-- Modal content --> */}
            
        </div>

    </div>
      
    );
  }