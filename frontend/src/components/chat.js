import React, {useContext, useState, useEffect} from "react";
import MessageList from './messageList.js';
import '../style/style.css';
//importing socket so application can have one instance of socket
import {sendMessage, socket, updatePlayerInfo} from '../utility/socket.js';
import ScratchPad from "./scratchPad.js";


export default function Chat({ context }) {
    const [userInfo, setUserInfo] = useContext(context);

    const [message, setMessage] = useState('');
    const [toggle, setToggle] = useState(userInfo.chatToggle ? userInfo.chatToggle : 'chat-toggle')

    //local table conent gets saved on the server but is also saved here
    const [localMessageList, setLocalMessageList] = useState(userInfo.messages)

    let hidden = true
  if (userInfo.username){
    hidden = false
  }
//   console.log(localMessageList)
    function changeInput(e){
        e.preventDefault();
        setMessage(e.target.value);
    }

    function addMessage(message, username){
        let updatedState = Object.assign([],localMessageList);
        updatedState = localMessageList.concat([[message, username]]) 
        //you could save messages at this point if you send it to the back end
        setLocalMessageList(updatedState);   
        updatePlayerInfo({messages:updatedState, username:userInfo.username, action:'chat'})
    }

    function handleSubmit(e){
        e.preventDefault();
        sendMessage({message:message, username:userInfo.username});
        addMessage(message,userInfo.username);
        e.target.children[0].value = ''
       
    }

    function toggleDisplay(e){
        setToggle(e.target.id)
        updatePlayerInfo({chatToggle:e.target.id, username:userInfo.username,action:'chat-toggle'})
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
                score: userInfo.score,
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
        <div className={`chat page ${hidden ? "hidden" : ""}`}>
            <div className="chatArea">
                    <div className="chat-toolbar">
                        <div className="button-box">
                            <button className="button" id="chat-toggle" onClick={toggleDisplay}>chat</button>
                            <button className="button" id="scratch-toggle" onClick={toggleDisplay}>scratch</button>
                        </div>
                        <div className="roomName">
                            Username: {userInfo.username}<br/>
                            Room Name: {userInfo.roomName}<br/>
                            Password: {userInfo.password}<br/>
                        </div>
                    </div>
                <div className={`chatDisplay ${toggle === 'chat-toggle' ? "" : "hidden"}`}>
                    <div id="messages" className="messages">
                        <MessageList messages={localMessageList} />
                    </div>
                    <form className="messageInput" onSubmit={handleSubmit}> 
                        <input id="inputMessage" autoFocus className="inputMessage" placeholder="Type here..." onChange={changeInput} />
                    </form>
                </div>
                <ScratchPad context={context} toggle={toggle}/>

            </div>
            {/* <NotePad/> */}
        </div>
    );
  }