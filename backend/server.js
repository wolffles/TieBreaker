const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;


server.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});


//Dashboard
// let numUsers = 0;
// let players = [];

// io.sockets.on('connect', function(socket) {
//   const sessionID = socket.id;
// });

io.on('connection', (client) => {
    client.on('message', (data) => {
        console.log(data);
        client.broadcast.emit('message', data);

      });

      
});