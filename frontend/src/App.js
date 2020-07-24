import React,  { useState } from 'react';
//import logo from './logo.svg';
import { createContext } from 'react';

import Chat from './components/chat.js';
import Dashboard from './components/dashboard.js';
import Login from './components/login.js';
import userContext from './context/players.js';
// import './style/App.css';
import './style/style.css';
//import SocketUtility from './utility/socketUtility.js'

//import './style/style.css';
//import './style/login.css';


function App() {
  let userContext = createContext();
  let [userInfo, setUserInfo] = useState(userContext);
  //

  function app(){
      return (
        <div className="pages">
          <Login context={userContext} />
          <Chat context={userContext} />
          <Dashboard context={userContext}/>
        </div>
      )
    
  }
  return (
    <userContext.Provider value={[userInfo, setUserInfo]}>
       {app()} 
    </userContext.Provider>
  );
}

export default App;
