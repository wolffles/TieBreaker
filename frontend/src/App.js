import React,  { useState } from 'react';
//import logo from './logo.svg';
import { createContext } from 'react';
import ShowData from './components/showData.js'
import Chat from './components/chat.js';
import Dashboard from './components/dashboard.js';
import Gameboard from './components/gameboard.js';
//import './style/style.css';
//import './style/login.css';


function App() {
  const UserContext = createContext({});
  const [userInfo, setUserInfo] = useState('Felix');
  //
  return (
    <UserContext.Provider value={[userInfo, setUserInfo]}>
            <Gameboard />   
        </UserContext.Provider>
  );
}

export default App;
