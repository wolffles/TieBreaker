import openSocket from 'socket.io-client';
export const  socket = openSocket('https://tie-breaker.herokuapp.com/');

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
