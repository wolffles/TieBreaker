import React, {useContext, createContext, useState, useEffect} from "react";
import { socket} from '../utility/socket.js';
import { FaInfoCircle } from 'react-icons/fa';
import AlertModal from './alertModal.jsx'
import {userContext} from '../App.jsx';



export default function Login() {

  let [userInfo, setUserInfo] = useContext(userContext);

  let inputContext = createContext('');
  let [inputValue, setInputContext] = useState(inputContext);

  let gameContext = createContext('');
  let [gameValue, setGameContext] = useState(gameContext);

  let passwordContext = createContext('');
  let [passwordValue, setPasswordContext] = useState(passwordContext);

  let [reconnectingValue, setReconnectingContext] = useState(false);

  let [showAlert, setShowAlert] = useState(false);

  let [alertText, setAlertText] = useState('');

  let hidden = false
  if (userInfo?.username){
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
      roomName: roomName,
      password: password,
      reconnecting: reconnecting
    }

    socket.emit('add user', data);
    }else{
      //alert('Please enter a username, game room name, and password');
      setAlertText('Please enter a username, game room name, and password')
      setShowAlert(true)
    }
  }

  function alertInfo(e) {
    e.preventDefault();
    alert("Please enter a nickname, the game room you would like to enter, and a password for the room. \n \n If you want to create a room, enter a room name that doesn't exist with a password you'd like to use. \n \n You must enter the correct password for game rooms that already exist. \n \n If you are reconnecting to a game room, please check the box right by the question on the screen")
    setAlertText("Please enter a nickname, the game room you would like to enter, and a password for the room. You must enter the correct password for game rooms that already exist. If you are reconnecting to a game room, pease check the box right by the question on the screen")
    setShowAlert(true)

  }

  useEffect(() => {
    window.onclick = function(event) {
      let modalElement = document.getElementById('alertModalBackground');
      if (showAlert && event.target === modalElement) {
          setShowAlert(false)
        }
      }


    socket.on('update player state', (data) => {
      setUserInfo(prevState => ({
        ...prevState,
        username: data.username,
        id: data.id,
        color: data.color,
        roomName: data.roomName,
        messages: data.messages ? [...prevState.messages,data.messages] : data.messages,
        scratchPad: data.scratchPad
      }));
    })


    socket.on('wrong password',(roomName) =>{
      setShowAlert(true)
      setAlertText(`You entered the wrong password for existing room "${roomName}". Please enter the correct password, or try entering a room with a different name`);
    });

    socket.on('too many users',(roomName) =>{
      setShowAlert(true)
      setAlertText(`There are currently 12 users connected to room "${roomName}". Please connect to another room with less users`);
    });

    return function cleanup() {
      //  socket.off('login');
       socket.off('update player state')
       socket.off('wrong password');
       socket.off('too many users')
       //  socket.off('update game state')
      };
  });

    return (
      <div className={`login page ${hidden ? "hidden" : ""}`} style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        <span className="login-info" onClick={(e) => alertInfo(e)}><FaInfoCircle size="2em" /></span>
        <div className="login-container">
            <form id="loginForm" className="loginform" onSubmit={handleSubmit}>
            <h1 style={{
              textAlign: 'center', 
              fontSize: "clamp(1.75rem, 4vw, 3rem)", 
              letterSpacing: "clamp(5px, 2vw, 10px)", 
              color: "aqua", 
              fontWeight: "bold", 
              padding: "clamp(0.5rem, 2vw, 1rem)",
              margin: "0 0 1rem 0"
            }}>TIEBREAKER</h1>
                <p className="title">What's your nickname?</p>
                  <input id="nicknameInput" className="loginInput" type="text" maxLength="15" onChange={changeInput}/>
                <p className="title">Enter a game room name: </p>
                   <input id="gameInput" className="loginInput" type="text" maxLength="8" onChange={changeGameInput}/>
                <p className="title">Enter a Password: </p>
                   <input id="passwordInput" className="loginInput" type="text" maxLength="8" onChange={changePasswordInput}/>
                <p className="title">Are you a reconnecting user?  <input className="reconnecting"  type="checkbox" onClick={changeReconnecting}/> </p>
                   <input style={{display:"none"}}type="submit"></input>
                   <br/>
                   <button className="login-button"> Submit </button>
            </form>
        </div>
        <AlertModal showAlert={showAlert} alertText={alertText}/>
      </div>
    );
  }