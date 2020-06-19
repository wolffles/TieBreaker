import React, {useContext, createContext, useState, useEffect} from "react";
import '../style/login.css';
import '../style/style.css';
import userContext from '../context/players.js';
import {socket} from '../utility/socket.js';
import {getUsernameColor} from '../utility/playerMisc.js'



export default function Login({context}) {
  
  let [userInfo, setUserInfo] = useContext(context);

  let inputContext = createContext('');
  let [inputValue, setInputContext] = useState(inputContext);
  let hidden = false
  if (userInfo.username){
    hidden = true
  }
  function changeInput(e){
    e.preventDefault();
    setInputContext(e.target.value);
  }

  function handleSubmit(e){
    e.preventDefault();
    let updatedState = Object.assign({},userInfo);
    updatedState.username = inputValue;
    let username = inputValue;
    if (!updatedState.players){
      updatedState.players = {}
    }
    updatedState.players[username] = {
      username: username,
      life: 0,
      color: getUsernameColor(username)
    }
    updatedState.playersList = [username]
    setUserInfo(updatedState);
    socket.emit('add user', {username: username,id: socket.id });
  }

  useEffect(() => {
    socket.on('login', (data) =>{
        if (data.numUsers == 1) {
          console.log("I'm the host");
          let updatedState = Object.assign({},userInfo);
          updatedState.host = true;
          setUserInfo(updatedState);
        }else{
            console.log("i am not the host");
        }
    });
    socket.on('new player data', (data) =>{
      let updatedState = Object.assign({},userInfo);
      updatedState.players = data.players;
      updatedState.playersList = data.playersList;
      setUserInfo(updatedState);
    });

    socket.on('user left', (data) =>{
      let updatedState = Object.assign({},userInfo);
            if(userInfo.username){
             updatedState.messages = updatedState.messages ? updatedState.messages.concat([[`${data.username} left`, 'TieBreaker']]) : [[`${data.username} joined`, 'TieBreaker']];
            }
    });

    return function cleanup() {
       socket.off('login');
       socket.off('new player data');
       socket.off('user left');
      };
  });

    return (
      <div className={`login page ${hidden ? "hidden" : ""}`}>
        <form id="entername" className="form" onSubmit={handleSubmit}>
            <label className="title">What's your nickname?</label>
              <input className="usernameInput" type="text" maxLength="14" onChange={changeInput}/>
        </form>
      </div>
    );
  }