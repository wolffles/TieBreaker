import React, { createContext, useState, useEffect } from 'react';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Chat from './components/chat';
import './style/App.css';


// Create context outside of component to prevent recreation on each render
export const userContext = createContext();

function App() {
  // Initialize with an empty object that has the expected structure
  const [userInfo, setUserInfo] = useState({
    username: '',
    id: '',
    color: '',
    roomName: '',
    messages: [],
    scratchPad: '',
    connectedPlayersList: [],
    playersList: [],
    players: {},
    password: '',
    chatToggle: false
  });
  

  function app(){
    let display = ''
    if(userInfo?.username){
      display = (
        <div className="pages">
          <Chat context={userContext} />
          <Dashboard context={userContext}/>
        </div>
      )
    }else{
      display = (
      <div className="pages">
        <Login context={userContext} />
      </div>
      )
    }
    return (display)
  }
  return (
    <userContext.Provider value={[userInfo, setUserInfo]}>
       {app()} 
    </userContext.Provider>
  );
}

export default App; 