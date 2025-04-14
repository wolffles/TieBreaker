import React, {useContext, useState, useEffect, useRef} from "react";
import '../style/style.css';
import {updatePlayers, socket} from '../utility/socket.js';
import MessageList from './messageList.jsx';

export default function Chat({ context }) {
    const [userInfo, setUserInfo] = useContext(context);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(userInfo.messages || []);
    const [chatToggle, setChatToggle] = useState(userInfo.chatToggle || false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        setMessages(userInfo.messages || []);
        setChatToggle(userInfo.chatToggle || false);
    }, [userInfo.messages, userInfo.chatToggle]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    function handleChange(e) {
        setMessage(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (message.trim() === '') return;

        let updatedState = Object.assign({}, userInfo);
        let newMessage = {
            username: userInfo.username,
            message: message,
            timestamp: new Date().toISOString()
        };
        updatedState.messages = [...(updatedState.messages || []), newMessage];
        updatePlayers({players:updatedState.players, action:'setMessages', noRender:false});
        setMessage('');
    }

    function toggleChat() {
        let updatedState = Object.assign({}, userInfo);
        updatedState.chatToggle = !chatToggle;
        updatePlayers({players:updatedState.players, action:'setChatToggle', noRender:false});
    }

    return (
        <div className="chat">
            <div className="chatHeader">
                <h3>Chat</h3>
                <button onClick={toggleChat}>{chatToggle ? 'Hide' : 'Show'}</button>
            </div>
            {chatToggle && (
                <>
                    <MessageList messages={messages} />
                    <form onSubmit={handleSubmit} className="chatForm">
                        <input 
                            type="text" 
                            value={message} 
                            onChange={handleChange} 
                            placeholder="Type a message..."
                        />
                        <button type="submit">Send</button>
                    </form>
                    <div ref={messagesEndRef} />
                </>
            )}
        </div>
    );
} 