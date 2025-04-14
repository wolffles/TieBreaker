import React from 'react';
import '../style/style.css';

export default function MessageList({ messages }) {
    if (!messages || messages.length === 0) {
        return <div className="messageList empty">No messages yet</div>;
    }

    return (
        <div className="messageList">
            {messages.map((message, index) => (
                <div key={index} className="message">
                    <span className="messageUsername">{message.username}:</span>
                    <span className="messageText">{message.message}</span>
                    <span className="messageTime">
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                </div>
            ))}
        </div>
    );
} 