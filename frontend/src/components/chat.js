import React, {useContext, useState, createContext, useEffect} from "react";
import MessageList from './messageList.js';
import '../style/style.css';
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

    function addMessage(message, username){
        let updatedState = Object.assign({},userInfo);
        if(updatedState.messages){
        updatedState.messages = updatedState.messages.concat([[message, username]]) 
        setUserInfo(updatedState);   
        }
    }

    function handleSubmit(e){
        e.preventDefault();
        sendMessage({message:message, username:userInfo.username});
        addMessage(message,userInfo.username);
       
    }
    useEffect(() => {
        var div = document.getElementById("messages");

        if(!!div){
         div.scrollTop = div.scrollHeight - div.clientHeight;
        }

        socket.on('reconnect', () => {
            console.log("you've auto reconnected")
            if (userInfo.username) {
              let data = {
                reconnecting: true,
                password: userInfo.password,
                life: userInfo.life,
                username: userInfo.username,
                roomName: userInfo.roomName
              }
              socket.emit('add user', data);
              addMessage("you have auto reconnected");
            }
          });

        socket.on('disconnect', () => {
            console.log("you've been disconnected")
            addMessage('you have been disconnected');
          });

        socket.on('reconnect_error', () => {
            console.log("reconnecting has failed")
            addMessage('attempt to reconnect has failed');
        });

        socket.on('message', (data) =>{
        //   console.log('made it to message');
            addMessage(data.message,data.username);
        });

        socket.on('server messages', (data) => {
            let updatedState = Object.assign({},userInfo);
            if(data.toBroadcast.userJoined){updatedState.messages.push(data.toBroadcast.userJoined)}
            if(data.toBroadcast.userLeft){updatedState.messages.push(data.toBroadcast.userLeft)}
            if(data.toBroadcast.numUsers){updatedState.messages.push(data.toBroadcast.numUsers)}
            if(data.toBroadcast.userRemoved){updatedState.messages.push(data.toBroadcast.userRemoved)}
              setUserInfo(updatedState);   
          });
        
        return function cleanup() {
            socket.off('reconnect');    
            socket.off('message');
            socket.off('server messages');
            socket.off('reconnect_error');
            socket.off('disconnect')
          };
      });

      
    return (
        <div className="chat page">
            <div className="chatArea">
                <div id="messages" className="messages">
                    {/* <span className="server message">Welcome to TieBreaker</span> */}
                    <MessageList messages={userInfo.messages} />
                </div>
            </div>
            <form className="messageInput" onSubmit={handleSubmit}> 
                <input id="inputMessage" autoFocus className="inputMessage" placeholder="Type here..." onChange={changeInput} />
            </form>

        </div>
      
    );
  }