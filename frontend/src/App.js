import React,  { useState } from 'react';
//import logo from './logo.svg';
import { createContext } from 'react';
import ShowData from './components/showData.js'
import Chat from './components/chat.js';
import Dashboard from './components/dashboard.js';
import Gameboard from './components/gameboard.js';
import userContext from './context/players.js'

//import './style/style.css';
//import './style/login.css';


function App() {
  let userContext = createContext({players:{},username:null});
  let [userInfo, setUserInfo] = useState(userContext);
  //

  function dashboard(){
    if (userInfo.username == null){
    return <Gameboard context={userContext}/>;
    } else{
      return <Chat />;
    }
  }
  return (
    <userContext.Provider value={[userInfo, setUserInfo]}>
       {dashboard()} 
    </userContext.Provider>
  );
}

export default App;
