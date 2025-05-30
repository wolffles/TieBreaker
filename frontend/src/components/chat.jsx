import React, {useContext, useState, useEffect} from "react";
import MessageList from './messageList.jsx';
import '../style/style.css';
//importing socket so application can have one instance of socket
import {sendMessage, socket, updatePlayerInfo} from '../utility/socket.js'; 
import {userContext} from '../App.jsx';
import ScratchPad from "./scratchPad.jsx";
import { FaChevronUp } from 'react-icons/fa'


export default function Chat({isMobile}) {
    const [userInfo, setUserInfo] = useContext(userContext);

    const [message, setMessage] = useState('');
    const [toggle, setToggle] = useState(userInfo.chatToggle ? userInfo.chatToggle : 'chat-toggle')
    const [isOpen, setIsOpen] = useState(false);

    //local table conent gets saved on the server but is also saved here
    const [localMessageList, setLocalMessageList] = useState(userInfo.messages)

    let hidden = true
  if (userInfo.username){
    hidden = false
  }
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
        if (message === ''){
            return;
        }
        sendMessage({message:message, username:userInfo.username});
        addMessage(message,userInfo.username);
        setMessage('');
        document.getElementById('inputMessage').value = '';
    }

    function toggleDisplay(e){
        setToggle(e.target.id)
        updatePlayerInfo({chatToggle:e.target.id, username:userInfo.username,action:'chat-toggle'})
    }

    function toggleMobileChat(){
        setIsOpen(!isOpen)
    }
    useEffect(() => {
       if(!isMobile){
        setIsOpen(false)
       }
    }, [isMobile])


    useEffect(() => {
        var div = document.getElementById("chatDisplay");
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
              var today = new Date();
              var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();  
              console.log("you've been auto reconnected ", time)
              addMessage("you have auto reconnected ");
            }
          });

        socket.on('disconnect', () => {
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
            console.log("you've been disconnected ", time)
            addMessage('you have been disconnected');
          });

        socket.on('reconnect_error', () => {
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + ":" + today.getMilliseconds();
            console.log("reconnecting has failed ", time)
            addMessage('attempt to reconnect has failed');
        });

        socket.on('message', (data) =>{
            addMessage(data.message,data.username);
        });

        socket.on('server messages', (data) => {
            let updatedMessages = localMessageList;
            if(data.toBroadcast.userJoined){updatedMessages = [...updatedMessages, data.toBroadcast.userJoined]}
            if(data.toBroadcast.userLeft){updatedMessages = [...updatedMessages, data.toBroadcast.userLeft]}
            if(data.toBroadcast.numUsers){updatedMessages = [...updatedMessages, data.toBroadcast.numUsers]}
            if(data.toBroadcast.userRemoved){updatedMessages = [...updatedMessages, data.toBroadcast.userRemoved]}
            if(data.toBroadcast.userRmovedError){updatedMessages = [...updatedMessages, data.toBroadcast.userRemovedError]}
            setUserInfo({...userInfo, messages: updatedMessages});
            setLocalMessageList(updatedMessages)
          });
        
        return function cleanup() {
            socket.off('reconnect');    
            socket.off('message');
            socket.off('server messages');
            socket.off('reconnect_error');
            socket.off('disconnect')
          };
      }, [userInfo]);

      
    return (

            <div className={`${isMobile ? "mobileChatPage" : "chatPage"} ${hidden ? "hidden" : ""} ${isOpen ? "active" : ""}`}>
                {isMobile && (
                    <div className={`mobileChatToggle ${isOpen ? "active" : ""}`}
                        style={{
                            width: '100%',
                            color: 'white',
                            backgroundColor: 'black',
                            textAlign: 'center',
                            fontSize: '2rem',
                            height: '40px'
                        }}
                        onClick={toggleMobileChat}
                    >
                        <FaChevronUp />
                    </div>
                    )}
                {/* <div className="chatArea"> */}
                    <div className="chat-toolbar">
                        <div className="button-box">
                            <button className="button" id="chat-toggle" style={{color: "white"}} onClick={toggleDisplay}>chat</button>
                            <button className="button" id="scratch-toggle" style={{color: "white"}} onClick={toggleDisplay}>scratch</button>
                        </div>
                        <div className="roomName">
                            Username: {userInfo.username}<br/>
                            Room Name: {userInfo.roomName}<br/>
                            Password: {userInfo.password}<br/>
                        </div>
                    </div>
                    <ScratchPad toggle={toggle}/>
                    <div id='chatDisplay' className={`chatDisplay ${toggle === 'chat-toggle' ? "" : "hidden"}`}>
                        <div id="messages" className="messages">
                            <MessageList messages={localMessageList} />
                        </div>
                        <form className="message-form" onSubmit={handleSubmit}> 
                            <textarea id="inputMessage" autoFocus rows="6"
                             className="inputMessage" placeholder="Type here..." 
                             onChange={changeInput} 
                             onKeyDown={e => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault(); // Prevents new line
                                  handleSubmit(e); 
                                }
                              }}
                            />
                            <button className="messageButton" id="send-button" style={{ backgroundColor: "#181818", color: "white"}} onClick={handleSubmit}>send</button>
                        </form>
                    </div>
                {/* </div> */}
                {/* <NotePad/> */}
            </div>
        // </>
    );
  }