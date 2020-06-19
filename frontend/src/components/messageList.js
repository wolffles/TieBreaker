import React, {useContext, useState, createContext, useEffect} from "react";

export default function MessageList({ messages} ) {
  let messageList;
  console.log('here are the messages', messages);
  if (messages){
    messageList = messages.map((message, i) =>{
      return <li key={i}>{message[1]}: {message[0]}</li>;
      });
      console.log('here is the message list', messageList);

  }

  return (
      <ul> {messageList} </ul>
  );
}