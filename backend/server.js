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
let numUsers = 0;
let players = [];

// io.sockets.on('connect', function(socket) {
//   const sessionID = socket.id;
// });

io.on('connection', (socket) => {
    socket.join('game1')
        let addedUser = false
    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('message', data);

      });
    socket.on('add user', (data) => {
        if (addedUser) return;
        if(players.indexOf(data.username) == -1){
            socket.username = data.username;
        }else if (players.indexOf(data.username) == -1){
            socket.username = data.username;
        }else{
            socket.username = data.username+'_'
        }
        ++numUsers;
        if(players.indexOf(data.username) == -1){
            players.push(socket.username);
            addedUser = true;
        }
        socket.emit('login', {
            numUsers: numUsers
        });
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers,
            id:data.id,
            reconnecting:reconnecting
        });
    })
      
});