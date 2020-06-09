import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');

function sendMessage(message){
    socket.emit('message', message);
}

function listenForMessage(){
    socket.on('message', (data) => {
        console.log('here is the message', data);
    });
}

export {sendMessage, listenForMessage};