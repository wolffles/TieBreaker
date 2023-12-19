import openSocket from 'socket.io-client';

let host

if(window.origin.includes("herokuapp") && window.origin.includes("tie-breaker7")){
    host = "https://tie-breaker7.herokuapp.com/"
}else if(window.origin.includes("herokuapp")) {
    host = "https://tie-breaker-1d45a4631458.herokuapp.com/" 
} else {
    host = "http://localhost:3001"
}

console.log('here is the host server', host);
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

export const updatePlayerInfo = (data) => {
    socket.emit('update player info', data)
}

//from server
