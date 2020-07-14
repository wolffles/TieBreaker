import openSocket from 'socket.io-client';

let host = window.origin == "http://localhost:3000" ? "http://localhost:3001" : "https://tie-breaker.herokuapp.com/" 

export const  socket = openSocket(host);

// to server
export const sendMessage = (data) => {
    socket.emit('message', data);
}

export const addUser = (data) => {
    socket.emit('add user', data)
}

export const updatePlayers = (data) => {
    socket.emit('update players', data)
}

//from server
