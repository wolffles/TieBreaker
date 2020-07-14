import openSocket from 'socket.io-client';

let host = window.origin.includes("herokuapp") ? "https://tie-breaker.herokuapp.com/" : "http://localhost:3001"

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
