import React, {useContext, useState, createContext, useEffect} from "react";
import {getUsernameColor} from '../utility/playerMisc'
export default function MessageList({ messages} ) {
  let messageList;
  console.log('here are the messages', messages);
  if (messages){
    messageList = messages.map((message, i) =>{
      return <li className="player message"key={i}>
        <div style={{color:getUsernameColor(message[1])}}>{message[1]}</div>: {message[0]}
        </li>;
      });
      console.log('here is the message list', messageList);

  }

  return (
      <ul> {messageList} </ul>
  );
}