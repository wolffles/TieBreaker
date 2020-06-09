import React,  { useState } from 'react';
//import logo from './logo.svg';
import { createContext } from 'react';
import ShowData from './components/showData.js'
import Chat from './components/chat.js';
import Dashboard from './components/dashboard.js';
import Login from './components/login.js';
import userContext from './context/players.js'

//import './style/style.css';
//import './style/login.css';


function App() {
  let userContext = createContext();
  let [userInfo, setUserInfo] = useState(userContext);
  //

  function app(){
    if (userInfo.username == null){
    return <Login context={userContext}/>;
    } else{
      return (
        <div>
          <Dashboard context={userContext}/>
          <Chat context={userContext}/>
        </div>
      )
    }
  }
  return (
    <userContext.Provider value={[userInfo, setUserInfo]}>
       {app()} 
    </userContext.Provider>
  );
}

export default App;
