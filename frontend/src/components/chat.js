import React, {useContext, useState, createContext, useEffect} from "react";
import MessageList from './messageList.js';
import '../style/style.css';
//inporting socket so application can have one instance of socket
import {sendMessage, socket} from '../utility/socket.js';
// import socketUtility from '../utility/socketUtility.js';


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
        updatedState.messages = updatedState.messages ? updatedState.messages.concat([[message, username]]) : [[message, username]];
        setUserInfo(updatedState);
    }

    function handleSubmit(e){
        e.preventDefault();
        sendMessage({message:message, username:userInfo.username});
        let updatedState = Object.assign({},userInfo);
        addMessage(message,userInfo.username);
      // console.log('here is the username', userInfo.username);
       
    }
    useEffect(() => {
        socket.on('message', (data) =>{
            addMessage(data.message,data.username);
            //console.log('here is the message from the server',data);
        });

        socket.on('user joined', (data) => {
            let updatedState = Object.assign({},userInfo);
            if(userInfo.username){
             updatedState.messages = updatedState.messages ? updatedState.messages.concat([[`${data.username} joined`, 'TieBreaker']]) : [[`${data.username} joined`, 'TieBreaker']];
            }

            if(!data.reconnecting){
           // console.log('user is not reconnecting aka NEW PLAYER create div for player')
   
            if (!updatedState.players){
                updatedState.players = {}
              }

              updatedState.players[data.username] = {username: data.username, life:0};

              if (!updatedState.playersList){
                updatedState.playersList = [];
              }

            if (updatedState.playersList.indexOf(data.username) == -1){
              updatedState.playersList.push(data.username);
            }
              setUserInfo(updatedState);   
            }

            if (userInfo.host === true){
               socket.emit('update new player', {players:userInfo.players, playersList:userInfo.playersList, id: data.id});
               //console.log("I'm host sending info to new player")
            }
          });
        
        return function cleanup() {
           socket.off('message');
           socket.off('user joined');
          };
      });

      
    return (
        <div className="chat page">
            <div className="chatArea">
                <div className="messages">
                    <MessageList messages={userInfo.messages} />
                </div>
            </div>
            <form className="messageInput" onSubmit={handleSubmit}> 
                <input className="inputMessage" placeholder="Type here..." onChange={changeInput} />
            </form>

        </div>
      
    );
  }