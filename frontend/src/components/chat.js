import React, {useContext, useState, createContext, useEffect} from "react";
import MessageList from './messageList.js';
//inporting socket so application can have one instance of socket
import {sendMessage, socket} from '../utility/socket.js';


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
    useEffect(() => {
        socket.on('message', (data) =>{
            console.log('here is the message from the server',data);
        });
        return function cleanup() {
           socket.off('message');
          };
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