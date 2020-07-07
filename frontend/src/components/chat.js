import React, {useContext, useState, createContext, useEffect} from "react";
import MessageList from './messageList.js';
import '../style/style.css';
//inporting socket so application can have one instance of socket
import {sendMessage, socket} from '../utility/socket.js';
// import socketUtility from '../utility/socketUtility.js';
import {getUsernameColor} from '../utility/playerMisc.js'


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
        updatedState.messages = updatedState.messages.concat([[message, username]]) 
        setUserInfo(updatedState);   
    }

    function handleSubmit(e){
        e.preventDefault();
        sendMessage({message:message, username:userInfo.username});
        addMessage(message,userInfo.username);
       
    }
    useEffect(() => {
        var div = document.getElementById("messages");
        div.scrollTop = div.scrollHeight - div.clientHeight;

        socket.on('message', (data) =>{
            addMessage(data.message,data.username);
        });

        socket.on('server messages', (data) => {
            let updatedState = Object.assign({},userInfo);
            updatedState.messages.push(data.toBroadcast.userJoined)
            updatedState.messages.push(data.toBroadcast.numUsers)

            // if(!data.reconnecting){
           // console.log('user is not reconnecting aka NEW PLAYER create div for player')
   
            // if (!updatedState.players){
            //     updatedState.players = {}
            //   }

              // updatedState.players[data.username] = {username: data.username, life:0, color:getUsernameColor(data.username)};

              // if (!updatedState.playersList){
              //   updatedState.playersList = [];
              // }

            // if (updatedState.playersList.indexOf(updatedState.username) == -1){
            //   updatedState.playersList.push(updatedState.username);
            // }
          // }
              setUserInfo(updatedState);   
          });
        
        return function cleanup() {
           socket.off('message');
           socket.off('server messages');
          };
      });

      
    return (
        <div className="chat page">
            <div className="chatArea">
                <div id="messages" className="messages">
                    <MessageList messages={userInfo.messages} />
                </div>
            </div>
            <form className="messageInput" onSubmit={handleSubmit}> 
                <input id="inputMessage" autoFocus className="inputMessage" placeholder="Type here..." onChange={changeInput} />
            </form>

        </div>
      
    );
  }