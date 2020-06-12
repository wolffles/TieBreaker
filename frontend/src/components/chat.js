import React, {useContext, useState, createContext, useEffect} from "react";
import MessageList from './messageList.js';
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
       updatedState.messages = updatedState.messages ? updatedState.messages.concat([[message, userInfo.username]]) : [[message, userInfo.username]]
       setUserInfo(updatedState);
        addMessage(message,userInfo.username);
    }
    useEffect(() => {
        socket.on('message', (data) =>{
            addMessage(data.message,data.username);
            console.log('here is the message from the server',data);
        });

        socket.on('user joined', (data) => {
      
    
            addMessage(`${data.username} joined`, 'TieBreaker');
            if(!data.reconnecting){
             // console.log('user is not reconnecting creating div for player')
              let updatedState = Object.assign({},userInfo);
              updatedState.players[data.username] = {username: data.username, life:0};
              updatedState.playersList.push(data.username);
              setUserInfo(updatedState);           
            }

            if (userInfo.host === true){
               socket.emit('update new player', {players:userInfo.players, playersList:userInfo.playersList, id: data.id});
               console.log("I'm host sending info to new player")
            }
          });
        
        return function cleanup() {
           socket.off('message');
           socket.off('user joined');
          };
      });

      
    return (
        <div className="pages" id="pages">
        <div className="chat page">
            <button id="bellbtn">bell</button>
            <div className="chatArea">
                <div className="messages">
                    {/* <Messages />     */}
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