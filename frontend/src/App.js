import React,  { useState } from 'react';
//import logo from './logo.svg';
import { createContext } from 'react';
import ShowData from './components/showData.js'
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
    // let display = '';
    // if (userInfo.username){
    //   display = 'hidden';
    // }
      return (
        <div className="pages">
          {/* <div className={display}> */}
          <Login context={userContext} />
          {/* </div> */}
          {/* <SocketUtility context={userContext} /> */}
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
