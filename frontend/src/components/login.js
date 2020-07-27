import React, {useContext, createContext, useState, useEffect} from "react";
import '../style/login.css';
import '../style/style.css';
import { socket} from '../utility/socket.js';
import ScratchPad from "./scratchPad";



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
      score: 0,
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


    socket.on('update player state', (data) => {
      // console.log('made it to update player state')
      let updatedState = Object.assign({},userInfo);
      updatedState.username = data.username
      updatedState.score = data.score
      updatedState.score2 = data.score2
      updatedState.id = data.id
      updatedState.color = data.color
      updatedState.roomName = data.roomName
      updatedState.messages = updatedState.messages ? updatedState.messages.concat(data.messages) : data.messages
      console.log(data.scratchPad)
      updatedState.scratchPad = data.scratchPad
      setUserInfo(updatedState);
    })

    socket.on('wrong password',(roomName) =>{
      alert(`You entered the wrong password for existing room "${roomName}". Please enter the correct password, or try entering a room with a different name`);
    });

    return function cleanup() {
      //  socket.off('login');
       socket.off('update player state')
       socket.off('wrong password');
       //  socket.off('update game state')
      };
  });

    return (
      <div className={`login page ${hidden ? "hidden" : ""}`}>
        <form id="loginForm" className="form" onSubmit={handleSubmit}>
            <p className="title">What's your nickname?</p>
              <input id="nicknameInput" className="loginInput" type="text" maxLength="8" onChange={changeInput}/>
            <p className="title">Enter a game room name: </p> 
               <input id="gameInput" className="loginInput" type="text" maxLength="8" onChange={changeGameInput}/> 
            <p className="title">Enter a Password: </p> 
               <input id="passwordInput" className="loginInput" type="text" maxLength="8" onChange={changePasswordInput}/> 
            <p className="title">Are you a reconnecting user? </p> 
               <input className="reconnecting"  type="checkbox" onClick={changeReconnecting}/>
               <br/>
               <input style={{display:"none"}}type="submit"></input>
        </form>
      </div>
    );
  }