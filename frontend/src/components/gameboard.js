import React, {useContext, createContext, useState, forceUpdate} from "react";
// import '../style/login.css';
import userContext from '../context/players.js'

export default function Gameboard({context}) {
  
  let [userInfo, setUserInfo] = useContext(context);

  let inputContext = createContext('');
  let [inputValue, setInputContext] = useState(inputContext);
  
  function changeInput(e){
    e.preventDefault();
    setInputContext(e.target.value);
  }
  
  function handleSubmit(e){
    e.preventDefault();
    let updatedState = Object.create(userInfo);
    updatedState.username = inputValue;
    setUserInfo(updatedState);
  }

  function dashboard(){
    if (userInfo.username == null) {
      return (<div className="login page">
        <form id="entername" className="form" onSubmit={handleSubmit}>
            <label className="title">What's your nickname?</label>
            {/* <label>
              */}
              <input className="usernameInput" type="text" maxLength="14" onChange={changeInput}/>
            {/* </label> */}
        </form>
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
        <div className="login page">
        <form id="entername" className="form" onSubmit={handleSubmit}>
            <label className="title">What's your nickname?</label>
            {/* <label>
              */}
              <input className="usernameInput" type="text" maxLength="14" onChange={changeInput}/>
            {/* </label> */}
        </form>
      </div>
      </div>
    );
  }