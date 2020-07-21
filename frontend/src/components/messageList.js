import React from "react";
import {getUsernameColor, isLink} from '../utility/playerMisc'
export default function MessageList({ messages} ) {
  let messageList;

  if (messages){
    messageList = messages.map((message, i) =>{
      if(isLink(message[0])){
      return <li className="playerMessage"key={i}>
        <span className="spanMessage" style={{color:getUsernameColor(message[1])}}>{message[1]}</span>: <a target="_blank" href={message[0]}>{message[0]}</a>
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
      });


  }

  return (
      <ul className="messageList"> {messageList} </ul>
  );
}