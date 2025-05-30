import React, { createContext, useState, useEffect } from 'react';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Chat from './components/chat';


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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const orientation = () => {
    if(isMobile){
      return (
        <div className="app-container">
          <Dashboard context={userContext} />
          <Chat context={userContext} isMobile={isMobile}/>
        </div>
      )
    }else{
      return (
        <div className="app-container">
          <Chat context={userContext} />
          <Dashboard context={userContext} />
        </div>
      )
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  function app(){
    let display = ''
    if(userInfo?.username){
      display = (
        <div className="pages">
          {orientation()}
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
       {/* <Test /> */}
    </userContext.Provider>
  );
}

export default App; 