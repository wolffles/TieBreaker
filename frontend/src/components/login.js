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

  let gameContext = createContext('');
  let [gameValue, setGameContext] = useState(gameContext);

  let passwordContext = createContext('');
  let [passwordValue, setPasswordContext] = useState(passwordContext);

  let [reconnectingValue, setReconnectingContext] = useState(false);

  let hidden = false
  if (userInfo.username){
    hidden = true
  }
  function changeInput(e){
    setInputContext(e.target.value);
  }

  function changeGameInput(e){
    setGameContext(e.target.value);
  }

  function changePasswordInput(e){
    e.preventDefault();
    setPasswordContext(e.target.value);
  }

  function changeReconnecting(e){
    setReconnectingContext(!reconnectingValue)
  }

  function handleSubmit(e){
    e.preventDefault();
    if(inputValue.length > 0 && gameValue.length > 0 && passwordValue.length > 0){
    let reconnecting = reconnectingValue
    let username = inputValue;
    let roomName = gameValue;
    let password = passwordValue;
    let data = {}
    data = {
      id: socket.id,
      username: username,
      life: 0,
      color: getUsernameColor(username),
      roomName: roomName,
      password: password,
      reconnecting: reconnecting
    }

    socket.emit('add user', data);
    }else{
      alert('Please enter a username, game room name, and password');
    }
  }

  useEffect(() => {

    // socket.on('login', (data) =>{
    //     if (data.numUsers == 1) {
    //       console.log("I'm the host");
    //       let updatedState = Object.assign({},userInfo);
    //       updatedState.host = true;
    //       setUserInfo(updatedState);
    //     }else{
    //         console.log("i am not the host");
    //     }
    // });
    // socket.on('new player data', (data) =>{
    //   let updatedState = Object.assign({},userInfo);
    //   updatedState.players = data.players;
    //   updatedState.playersList = data.playersList;
    //   setUserInfo(updatedState);
    // });

    socket.on('user left', (data) =>{
      let updatedState = Object.assign({},userInfo);
      
    });


    socket.on('update player state', (data) => {
      // console.log('made it to update player state')
      let updatedState = Object.assign({},userInfo);
      updatedState.username = data.username
      updatedState.life = data.life
      updatedState.id = data.id
      updatedState.color = data.color
      updatedState.roomName = data.roomName
      updatedState.messages = data.messages
      setUserInfo(updatedState);
    })

    socket.on('wrong password',(roomName) =>{
      alert(`You entered the wrong password for existing room "${roomName}". Please enter the correct password, or try entering a room with a different name`);
    });

    // moved to dashboard
    // socket.on('update game state', (data) => {
    //   let updatedState = Object.assign({},userInfo);
    //   updatedState.connectedPlayersList = data.connectedPlayersList
    //   updatedState.playersList = data.savedPlayersList
    //   updatedState.players = data.savedPlayers
    //   setUserInfo(updatedState);
    // })


    return function cleanup() {
      //  socket.off('login');
      // socket.off('new player data');
       socket.off('user left');
       socket.off('update player state')
       socket.off('wrong password');
       //  socket.off('update game state')
      };
  });

    return (
      <div className={`login page ${hidden ? "hidden" : ""}`}>
        <form id="loginForm" className="form" onSubmit={handleSubmit}>
            <p className="title">What's your nickname?</p>
              <input id="nicknameInput" className="loginInput" type="text" maxLength="14" onChange={changeInput}/>
            <p className="title">Enter a game room name: </p> 
               <input id="gameInput" className="loginInput" type="text" maxLength="14" onChange={changeGameInput}/> 
            <p className="title">Enter a Password: </p> 
               <input id="passwordInput" className="loginInput" type="text" maxLength="14" onChange={changePasswordInput}/> 
            <p className="title">Are you a reconnecting user? </p> 
               <input className="reconnecting"  type="checkbox" onClick={changeReconnecting}/>
               <br/>
               <input style={{display:"none"}}type="submit"></input>
        </form>
      </div>
    );
  }