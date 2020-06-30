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
let whoIsHost = '';

// io.sockets.on('connect', function(socket) {
//   const sessionID = socket.id;
// });
/*
    this will be where we abstract functions for reusability
*/


io.on('connection', (socket) => {
    socket.join('game1')
        let addedUser = false
    socket.emit('send connectedPlayersList', {
        connectedPlayersList: connectedPlayersList,
    });
    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('message', data);

      });
    socket.on('add user', (data) => {
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
        console.log(numUsers, "numUsers")
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
            console.log("numUsers", numUsers)
            let idx = connectedPlayersList.indexOf(socket.username);
            connectedPlayersList.splice(idx,1);
            //check to see if the logged out player was host and updates
            if (socket.username == whoIsHost){
                console.log(socket.username, "socket username check was hit")
                whoIsHost = connectedPlayersList.length > 0 ? connectedPlayersList[0] : ''
                console.log(whoIsHost)
                broadcastData(socket, 'updating host', {
                    connectedPlayersList: connectedPlayersList,
                    updatingHost: whoIsHost
                })
            }
            // echo globally that this client has left
            broadcastData(socket,'user left', {
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

// HELPER FUNCTIONS
/**
 * emitData sends information to the client listening or that requested information
 * @param {Object} socket 
 * @param {Object} dataObj 
 */
const emitData = (socket, listenString, dataObj) => {
    socket.emit(listenString, dataObj)
}

const broadcastData = (socket, listenString, dataObj) => {
    socket.broadcast.emit(listenString, dataObj)
}