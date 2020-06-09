import React, {useContext, useState, createContext, useEffect} from "react";
import MessageList from './messageList.js';
import {sendMessage, listenForMessage} from '../utility/socket.js';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');

export default function Chat({ context }) {
    const [userInfo, setUserInfo] = useContext(context);


    let inputContext = createContext('')
    let [message, setMessage] = useState(inputContext);

    function changeInput(e){
        e.preventDefault();
        setMessage(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        sendMessage([message, userInfo.username]);
        let updatedState = Object.assign({},userInfo);
        updatedState.messages = updatedState.messages ? updatedState.messages.concat([[message, userInfo.username]]) : [[message, userInfo.username]]
        setUserInfo(updatedState);
    }
    useEffect((e) => {
        //console.log('message', userInfo.messages)
        //this is the next thing that needs to be fixed. the event listener is called twice, so messages from the server is received multiple times
        listenForMessage();
      });

      
    return (
        <div className="pages" id="pages">
        <div className="chat page">
            <button id="bellbtn">bell</button>
            <div className="chatArea">
                <div className="messages">
                    {/* <Messages />  */}   
                </div>
            </div>
            <form className="form" onSubmit={handleSubmit}> 
                <input className="inputMessage" placeholder="Type here..." onChange={changeInput} />
            </form>
            <MessageList messages={userInfo.messages} />

        </div>
    </div>
      
    );
  }