import React, {useContext} from "react";
import '../style/login.css';

export default function Gameboard() {
    //const [userInfo, setUserInfo] = useContext(context);

  function playForm () {
       
  }

    return (
        <div className="login page">
        <div id="entername" className="form" onSubmit={playForm}>
            <h3 className="title">What's your nickname?</h3>
            <input className="usernameInput" type="text" maxLength="14" />
        </div>
    </div>
      
    );
  }