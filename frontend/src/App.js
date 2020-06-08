import React,  { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import { createContext } from 'react';
import ShowData from './components/showData.js'
import Chat from './components/chat.js';
import Dashboard from './components/dashboard.js';
import Login from './components/login.js';
import './style/style.css';


function App() {
  const UserContext = createContext({});
  const [userInfo, setUserInfo] = useState('Felix');
  //
  return (
    <UserContext.Provider value={[userInfo, setUserInfo]}>
       <Switch>
          <Route path="/">
            <Login />
          </Route>
          <Route path="/dashboard">
            <Users />
          </Route>
        </Switch>     
        </UserContext.Provider>
  );
}

export default App;
