import React, {useContext} from "react";
// import '../style/login.css';
import userContext from '../context/players.js'

export default function Gameboard({context}) {
  
  let [userInfo, setUserInfo] = useContext(context);
  console.log('this is user info before', userInfo)
  setUserInfo("hello")
  console.log('this is user info after', userInfo)
  function dashboard(){
    if (false) {
      return (<div className="login page">
        <div id="entername" className="form">
            <h3 className="title">What's your nickname?</h3>
            {/* <label>
              */}
              <input className="usernameInput" type="text" maxLength="14" />
            {/* </label> */}
        </div>
      </div>)
    }
    else{
      return (
      <div className="gameBoard">
        <div className="menubar">
          <form>
              <input id="hp" type="number" maxLength="10" placeholder="lifepoints" />
              <button hidden id="startGame"></button>  
          </form>
          <button id="showDie">Show Die</button>
        </div>
        <div id="playerArea">
        </div> 
      </div>)
    }
  }


    return (
      <div className="dashboard">
        <div id="playerArea"></div>
        {dashboard()}
      </div>
    );
  }