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
let frontPlayers = [];

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
        let reconnecting = false;
        if(players.indexOf(data.username) == -1){
            console.log('made it to 1');
            socket.username = data.username;
        } else{
            console.log('made it to 2');
            socket.username = data.username+'_';
        }
        ++numUsers;
        players.push(socket.username);
        console.log('here is the socket username', socket.username);
        if(frontPlayers.indexOf(socket.username) == -1){
  
            frontPlayers.push(socket.username);       
            addedUser = true;
        }else{
            reconnecting = true;
        }
        console.log('made it to add user');

        socket.emit('login', {
            numUsers: numUsers
        });

        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers,
            id:data.id,
            reconnecting:reconnecting
        });
    });

    // updating  all players with host information
    socket.on('update players', (data) => {
        socket.broadcast.emit('update player data', data);
    });
  

    socket.on('update new player', (data) => {
        io.to(data.id).emit('new player data', data);
      });

      socket.on('disconnect', () => {
        if (addedUser) {
          --numUsers;
          let idx = players.indexOf(socket.username);
          players.splice(idx,1);
          // echo globally that this client has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
          });
        }
      });
      
});