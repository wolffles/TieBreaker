import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');

function sendMessage(message){
    socket.emit('message', message);
}


export {sendMessage, socket};