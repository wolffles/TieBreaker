import React from 'react';
import Login from './components/login';
import Dashboard from './components/dashboard';
import './style/App.css';
import { createContext } from 'react';
import { useState } from 'react';
function App() {
  let userContext = createContext();
  let [userInfo, setUserInfo] = useState(userContext);
  //

  function app(){
    let display = ''
    if(userInfo.username){
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