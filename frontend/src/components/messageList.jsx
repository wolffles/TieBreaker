import React, {useEffect, useState} from "react";
import {getUsernameColor, isLink} from '../utility/playerMisc'

export default function MessageList({ messages} ) {
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    console.log("messages", messages)
    setMessageList(messages.map((message, i) =>{
      if(isLink(message[0])){
        return <li className="playerMessage"key={i}>
          <span className="spanMessage" style={{color:getUsernameColor(message[1])}}>{message[1]}</span>: <a target="_blank"  rel='noopener noreferrer' href={message[0]}>{message[0]}</a>
          </li>;
      }else if (message[1]){
        return <li className="playerMessage"key={i}>
        <span className="spanMessage" style={{color:getUsernameColor(message[1])}}>{message[1]}</span>: {message[0]}
        </li>;
      }else {
       return <li className="playerMessage"key={i}>
          <div className="serverMessage">{message[0]}</div>
        </li>;
      }
    }));
  }, [messages])

  return (
      <ul className="messageList"> {messageList} </ul>
  );
}