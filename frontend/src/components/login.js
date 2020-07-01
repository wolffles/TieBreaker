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
    let username = inputValue;
    let player = {}
    player = {
      id: socket.id,
      username: username,
      life: 0,
      color: getUsernameColor(username)
    }
    socket.emit('add user', player);
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

    socket.on('updating host',(data) => {
      console.log(userInfo.username)
      if(data.updatingHost == userInfo.username){
        let updatedState = Object.assign({},userInfo);
        updatedState.host = true;
        console.log("I'm the host")
        setUserInfo(updatedState);
      }
    })

    socket.on('update player state', (data) => {
      let updatedState = Object.assign({},userInfo);
      console.log('login.js 102', data.username)
      updatedState.username = data.username
      updatedState.life = data.life
      updatedState.id = data.id
      updatedState.color = data.color
      console.log(updatedState)
      setUserInfo(updatedState);
    })

    socket.on('update game state', (data) => {
      let updatedState = Object.assign({},userInfo);
      updatedState.connectedPlayersList = data.connectedPlayersList
      updatedState.playersList = data.savedPlayersList
      updatedState.players = data.savedPlayers
      console.log(updatedState)
      setUserInfo(updatedState);
    })


    return function cleanup() {
       socket.off('login');
       socket.off('new player data');
       socket.off('user left');
       socket.off('updating host')
       socket.off('update game state')
       socket.off('update player state')
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