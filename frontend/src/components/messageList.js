import React, {useContext, useState, createContext, useEffect} from "react";

export default function MessageList({ messages, username }) {
    let messageList;
    if (messages){
     messageList = messages.map((message, i) =>{
       return <li key={i}>{message[1]}: {message[0]}</li>;
    });
}

    return (
       <ul> {messageList} </ul>
    );
  }