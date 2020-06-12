import React, {useContext, createContext, useState, useEffect} from "react";
// import '../style/login.css';
import userContext from '../context/players.js';
import {socket} from '../utility/socket.js';

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
    updatedState.username = inputValue;
    let username = inputValue;
    if (!updatedState.players){
      updatedState.players = {}
    }
      updatedState.players[username] = {
        username: username,
        life: 0
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

    socket.on('user joined', (data) =>{
     console.log('user joined');

  });
  
    return function cleanup() {
       socket.off('login');
       socket.off('user joined');
      };
  });

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