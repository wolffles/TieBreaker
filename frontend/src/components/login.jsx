import React, {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import '../style/style.css';
import {socket} from '../utility/socket.js';

export default function Login({ context }) {
    const [userInfo, setUserInfo] = useContext(context);
    const [username, setUsername] = useState('');
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('login success', (data) => {
            let updatedState = Object.assign({}, userInfo);
            updatedState.username = data.username;
            updatedState.roomName = data.roomName;
            updatedState.password = data.password;
            updatedState.players = data.players;
            updatedState.connectedPlayersList = data.connectedPlayersList;
            updatedState.playersList = data.savedPlayersList;
            updatedState.scratchPad = data.scratchPad;
            updatedState.messages = data.messages;
            updatedState.chatToggle = data.chatToggle;
            setUserInfo(updatedState);
            navigate('/dashboard');
        });

        socket.on('login error', (error) => {
            setError(error);
            setIsLoading(false);
        });

        return function cleanup() {
            socket.off('login success');
            socket.off('login error');
        };
    }, [userInfo, navigate]);

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handleRoomNameChange(e) {
        setRoomName(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!username || !roomName) {
            setError('Username and room name are required');
            return;
        }

        setIsLoading(true);
        setError('');

        socket.emit('login', {
            username: username,
            roomName: roomName,
            password: password
        });
    }

    return (
        <div className="login">
            <h1>TieBreaker</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder="Enter your username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="roomName">Room Name</label>
                    <input
                        type="text"
                        id="roomName"
                        value={roomName}
                        onChange={handleRoomNameChange}
                        placeholder="Enter room name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password (Optional)</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter password"
                    />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Joining...' : 'Join Room'}
                </button>
            </form>
        </div>
    );
} 