import React, {useContext, createContext, useState, forceUpdate} from "react";
// import '../style/login.css';
import userContext from '../context/players.js'

export default function Login({context}) {
  
  let [userInfo, setUserInfo] = useContext(context);

  let inputContext = createContext('');
  let [inputValue, setInputContext] = useState(inputContext);
  
  function changeInput(e){
    e.preventDefault();
    setInputContext(e.target.value);
  }

  function handleSubmit(e){
    e.preventDefault();
    let updatedState = Object.assign({},userInfo);
    console.log('login', updatedState)
    updatedState.username = inputValue;
    let username = inputValue
    if (!updatedState.players){
      updatedState.players = {}
    }
      updatedState.players[username] = {
        username: username,
        life: 0
      }
      updatedState.playersList = [username]
    setUserInfo(updatedState);
  }


    return (
        <div className="login page">
        <form id="entername" className="form" onSubmit={handleSubmit}>
            <label className="title">What's your nickname?</label>
            {/* <label>
              */}
              <input className="usernameInput" type="text" maxLength="14" onChange={changeInput}/>
            {/* </label> */}
        </form>
      </div>
    );
  }