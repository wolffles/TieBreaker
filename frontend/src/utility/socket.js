import openSocket from 'socket.io-client';
export const  socket = openSocket('http://localhost:3001');

// to server
export const sendMessage = (data) => {
    socket.emit('message', data);
}

export const addUser = (data) => {
    socket.emit('add user', data)
}

//from server
