import React, {useContext, useState, createContext, useEffect} from "react";
// import MessageList from './messageList.js';
//inporting socket so application can have one instance of socket
import {sendMessage, socket} from './socket.js';
import {userContext} from '../App.jsx';

export default function SocketUtility() {
    const [userInfo, setUserInfo] = useContext(userContext);
   

    let inputContext = createContext('')
    let [message, setMessage] = useState(inputContext);

    function changeInput(e){
        e.preventDefault();
        setMessage(e.target.value);
    }

    function addMessage(message, username){
        let updatedState = Object.assign({},userInfo);
        updatedState.messages = updatedState.messages ? [...updatedState.messages, [message, username]] : [[message, username]]
        setUserInfo(updatedState);
    }

    function handleSubmit(e){
        e.preventDefault();
        sendMessage(message, userInfo.username);
        //let updatedState = Object.assign({},userInfo);
      //  updatedState.messages = updatedState.messages ? updatedState.messages.concat([[message, userInfo.username]]) : [[message, userInfo.username]]
      //  setUserInfo(updatedState);
        addMessage(message,userInfo.username);
    }
    useEffect(() => {
        socket.on('message', (data) =>{
            addMessage(data);
            // console.log('here is the message from the server',data);
        });
        return function cleanup() {
           socket.off('message');
          };
      });

      
    return (
        <div display="hidden"></div>
    )
  }