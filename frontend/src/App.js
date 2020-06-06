import React,  { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import { createContext } from 'react';
import ShowData from './showData.js'
import Chat from './chat.js';
import Dashboard from './dashboard.js';
import './style.css';


function App() {
  const UserContext = createContext({});
  const [userInfo, setUserInfo] = useState('Felix');
  //
  return (
    <UserContext.Provider value={[userInfo, setUserInfo]}>
            <Chat/>
            <Dashboard/>>
        </UserContext.Provider>
  );
}

export default App;
