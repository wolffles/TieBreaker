import React, {useContext, useState, useEffect} from "react";
import '../style/style.css';
import {updatePlayers, socket} from '../utility/socket.js';

export default function PlayerArea({ players, roomName, playersList, context }) {
    const [userInfo, setUserInfo] = useContext(context);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerPoints, setNewPlayerPoints] = useState('');

    function handlePlayerClick(player) {
        setSelectedPlayer(player);
    }

    function handleAddPlayer() {
        setIsAddingPlayer(true);
    }

    function handleCancelAdd() {
        setIsAddingPlayer(false);
        setNewPlayerName('');
        setNewPlayerPoints('');
    }

    function handleNewPlayerNameChange(e) {
        setNewPlayerName(e.target.value);
    }

    function handleNewPlayerPointsChange(e) {
        setNewPlayerPoints(e.target.value);
    }

    function handleAddPlayerSubmit(e) {
        e.preventDefault();
        if (!newPlayerName) return;

        let updatedState = Object.assign({}, userInfo);
        let points = newPlayerPoints ? [[newPlayerName, newPlayerPoints]] : [[newPlayerName, '0']];
        
        updatedState.players[newPlayerName] = {
            points: points,
            scratchPad: '',
            messages: [],
            chatToggle: false
        };
        
        updatePlayers({players:updatedState.players, action:'addPlayer', noRender:false});
        setIsAddingPlayer(false);
        setNewPlayerName('');
        setNewPlayerPoints('');
    }

    function handleRemovePlayer(playerName) {
        let updatedState = Object.assign({}, userInfo);
        delete updatedState.players[playerName];
        updatePlayers({players:updatedState.players, action:'removePlayer', noRender:false});
        if (selectedPlayer === playerName) {
            setSelectedPlayer(null);
        }
    }

    function handleUpdatePoints(playerName, pointName, value) {
        let updatedState = Object.assign({}, userInfo);
        let player = updatedState.players[playerName];
        let pointIndex = player.points.findIndex(p => p[0] === pointName);
        
        if (pointIndex !== -1) {
            player.points[pointIndex][1] = value;
        } else {
            player.points.push([pointName, value]);
        }
        
        updatePlayers({players:updatedState.players, action:'updatePoints', noRender:false});
    }

    function handleAddPoint(playerName) {
        let updatedState = Object.assign({}, userInfo);
        let player = updatedState.players[playerName];
        let newPointName = `Point ${player.points.length + 1}`;
        player.points.push([newPointName, '0']);
        updatePlayers({players:updatedState.players, action:'addPoint', noRender:false});
    }

    function handleRemovePoint(playerName, pointName) {
        let updatedState = Object.assign({}, userInfo);
        let player = updatedState.players[playerName];
        player.points = player.points.filter(p => p[0] !== pointName);
        updatePlayers({players:updatedState.players, action:'removePoint', noRender:false});
    }

    return (
        <div className="playerArea">
            <div className="playerList">
                <h3>Players</h3>
                <button onClick={handleAddPlayer}>Add Player</button>
                <ul>
                    {Object.keys(players).map(playerName => (
                        <li 
                            key={playerName} 
                            className={selectedPlayer === playerName ? 'selected' : ''}
                            onClick={() => handlePlayerClick(playerName)}
                        >
                            {playerName}
                        </li>
                    ))}
                </ul>
            </div>
            
            {isAddingPlayer && (
                <div className="addPlayerForm">
                    <h3>Add New Player</h3>
                    <form onSubmit={handleAddPlayerSubmit}>
                        <div className="form-group">
                            <label htmlFor="playerName">Player Name</label>
                            <input
                                type="text"
                                id="playerName"
                                value={newPlayerName}
                                onChange={handleNewPlayerNameChange}
                                placeholder="Enter player name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="playerPoints">Initial Points (Optional)</label>
                            <input
                                type="text"
                                id="playerPoints"
                                value={newPlayerPoints}
                                onChange={handleNewPlayerPointsChange}
                                placeholder="Enter initial points"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit">Add</button>
                            <button type="button" onClick={handleCancelAdd}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
            
            {selectedPlayer && (
                <div className="playerDetails">
                    <div className="playerHeader">
                        <h3>{selectedPlayer}</h3>
                        <button onClick={() => handleRemovePlayer(selectedPlayer)}>Remove Player</button>
                    </div>
                    
                    <div className="pointsList">
                        <h4>Points</h4>
                        <button onClick={() => handleAddPoint(selectedPlayer)}>Add Point</button>
                        <ul>
                            {players[selectedPlayer].points.map((point, index) => (
                                <li key={index}>
                                    <input
                                        type="text"
                                        value={point[0]}
                                        onChange={(e) => {
                                            let updatedState = Object.assign({}, userInfo);
                                            let player = updatedState.players[selectedPlayer];
                                            player.points[index][0] = e.target.value;
                                            updatePlayers({players:updatedState.players, action:'updatePointName', noRender:false});
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={point[1]}
                                        onChange={(e) => handleUpdatePoints(selectedPlayer, point[0], e.target.value)}
                                    />
                                    <button onClick={() => handleRemovePoint(selectedPlayer, point[0])}>×</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
} 