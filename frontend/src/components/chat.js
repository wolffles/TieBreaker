import React, {useContext, useState, createContext, useEffect} from "react";
import MessageList from './messageList.js';

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
        let updatedState = Object.assign({},userInfo);
        updatedState.messages = updatedState.messages ? updatedState.messages.concat([[message, userInfo.username]]) : [[message, userInfo.username]]
        setUserInfo(updatedState);
    }
    useEffect(() => {
        console.log('messages', userInfo.messages)
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