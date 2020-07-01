const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

const { createGameRoom, createPlayerObj } = require('./gameRoom');
const { isUsernameUnique } = require('./sourceCheck');

server.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});


//Dashboard
let whoIsHost = '';

let rooms = {}


io.on('connection', (socket) => {
    socket.join('game1')
        // going to convert the code to have different rooms
        if(!rooms['game1']){ rooms['game1'] = createGameRoom('game1') }
        let addedUser = false
    socket.emit('update game state', rooms['game1'])
    socket.on('message', (data) => {
        socket.broadcast.emit('message', data);

      });
    socket.on('add user', (data) => {
        if (addedUser) return;
        let reconnecting = false;
        if(isUsernameUnique(data.username, rooms['game1'])){
            socket.username = data.username;
        } else{
            socket.username = data.username+'_';
        }
        let player = createPlayerObj(socket.username, data)
        rooms['game1'].savedPlayers[socket.username] = player
        rooms['game1'].savedPlayersList.push(socket.username)
        ++(rooms['game1']).numUsers;
        (rooms['game1']).connectedPlayersList.push(socket.username);
        socket.emit('update player state', rooms['game1'].savedPlayers[socket.username])
        socket.emit('update game state', rooms['game1'] )

        // might not need below
        // if ( (rooms['game1']).numUsers == 0 ){ whoIsHost = socket.username }
        if((rooms['game1']).savedPlayersList.indexOf(socket.username) == -1){
            (rooms['game1']).savedPlayersList.push(socket.username);       
            addedUser = true;
        }else{
            reconnecting = true;
        }
        socket.emit('login', {
            numUsers: (rooms['game1']).numUsers
        });

        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: (rooms['game1']).numUsers,
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
            --(rooms['game1']).numUsers;
            console.log("numUsers", (rooms['game1']).numUsers)
            let idx = (rooms['game1']).connectedPlayersList.indexOf(socket.username);
            (rooms['game1']).connectedPlayersList.splice(idx,1);
            //check to see if the logged out player was host and updates
            if (socket.username == whoIsHost){
                console.log(socket.username, "socket username check was hit")
                whoIsHost = (rooms['game1']).connectedPlayersList.length > 0 ? (rooms['game1']).connectedPlayersList[0] : ''
                broadcastData(socket, 'updating host', {
                    connectedPlayersList: (rooms['game1']).connectedPlayersList,
                    updatingHost: whoIsHost
                })
            }
            // echo globally that this client has left
            broadcastData(socket,'user left', {
                username: socket.username,
                numUsers: (rooms['game1']).numUsers
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