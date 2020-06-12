import openSocket from 'socket.io-client';
export const  socket = openSocket('http://localhost:3001');

// to server
export const sendMessage = (message) => {
    socket.emit('message', message);
}

export const addUser = (data) => {
    socket.emit('add user', data)
}

//from server
