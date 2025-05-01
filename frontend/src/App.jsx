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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const orientation = () => {
    if(isMobile){
      return (
        <>
          <Dashboard context={userContext} />
          <Chat context={userContext} isMobile={isMobile}/>
        </>
      )
    }else{
      return (
        <>
          <Chat context={userContext} />
          <Dashboard context={userContext} />
        </>
      )
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
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