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

  let hidden = false
  if (userInfo.username){
    hidden = true
  }
  function changeInput(e){
    e.preventDefault();
    setInputContext(e.target.value);
  }

  function changeGameInput(e){
    e.preventDefault();
    setGameContext(e.target.value);
  }

  function handleSubmit(e){
    e.preventDefault();
    if(inputValue.length > 0 && gameValue.length >0){
    let username = inputValue;
    let gameName = gameValue;
    let data = {}
    data = {
      id: socket.id,
      username: username,
      life: 0,
      color: getUsernameColor(username),
      gameName: gameName
    }

    socket.emit('add user', data);
  }else{
    alert('Please enter both a username and a game room name');
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
            if(userInfo.username){
             updatedState.messages = updatedState.messages ? updatedState.messages.concat([[`${data.username} left`, 'TieBreaker']]) : [[`${data.username} joined`, 'TieBreaker']];
            }
    });


    socket.on('update player state', (data) => {
      let updatedState = Object.assign({},userInfo);
      updatedState.username = data.username
      updatedState.life = data.life
      updatedState.id = data.id
      updatedState.color = data.color
      updatedState.gameName = data.gameName
      setUserInfo(updatedState);
    })

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
       //  socket.off('update game state')
      };
  });

    return (
      <div className={`login page ${hidden ? "hidden" : ""}`}>
        <form className="form" onSubmit={handleSubmit}>
            <label className="title">What's your nickname?</label>
              <input className="usernameInput" type="text" maxLength="14" onChange={changeInput}/>
        </form>
        <br/>
        <form className="form2"  onSubmit={handleSubmit}>
           <label className="title">Enter a game room name: </label> 
               <input className="usernameInput" type="text" maxLength="14" onChange={changeGameInput}/> 
          </form>

      </div>
    );
  }