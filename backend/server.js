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
let connectedPlayersList = [];
let frontPlayers = [];
let whoIsHost = ''

// io.sockets.on('connect', function(socket) {
//   const sessionID = socket.id;
// });
/*
    this will be where we abstract functions for reusability
*/


io.on('connection', (socket) => {
    socket.join('game1')
        let addedUser = false
    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('message', data);

      });
    socket.on('add user', (data) => {
<<<<<<< HEAD
=======
        console.log('new user', data);
        console.log('here are the connectedPlayersList', connectedPlayersList);
>>>>>>> updates host on host disconnect
        if (addedUser) return;
        let reconnecting = false;
        if(connectedPlayersList.indexOf(data.username) == -1){
            socket.username = data.username;
        } else{
            socket.username = data.username+'_';
        }
        if ( numUsers == 0 ){ whoIsHost = socket.username }
        ++numUsers;
        connectedPlayersList.push(socket.username);
        if(frontPlayers.indexOf(socket.username) == -1){
  
            frontPlayers.push(socket.username);       
            addedUser = true;
        }else{
            reconnecting = true;
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
    });

    socket.on('update new player', (data) => {
        io.to(data.id).emit('new player data', data);
      });

      socket.on('disconnect', () => {
        if (addedUser) {
          --numUsers;
          let idx = connectedPlayersList.indexOf(socket.username);
          connectedPlayersList.splice(idx,1);
          //check to see if the logged out player was host and updates
          if (socket.username == whoIsHost){
            whoIsHost = connectedPlayersList.length > 0 ? connectedPlayersList[0] : ''
            socket.broadcast.emit('updating host', {
                updatingHost: whoIsHost
              });
          }
          // echo globally that this client has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
          });
        }
      });
    
    // this will be called when we need to update any player
    socket.on('update players', (data) => {
        if(data){

        }
    })
});