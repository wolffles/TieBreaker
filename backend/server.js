const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

const { newPlayerInRoom, createGameRoom, createPlayerObj, userConnectedToRoom } = require('./gameRoom');
const { isUsernameUnique } = require('./sourceCheck');

server.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});


//Dashboard

let rooms = {}


io.on('connection', (socket) => {
 //   socket.join('game1')
        // going to convert the code to have different rooms
      //  if(!rooms['game1']){ rooms['game1'] = createGameRoom('game1') }
      let addedUser = false
   // socket.emit('update game state', rooms['game1'])
    socket.on('message', (data) => {
        broadcastData(socket, socket.roomName,'message', data);

      });

    socket.on('add user', (data) => {
        if (addedUser) return;
        let roomName = data.roomName;
        socket.roomName = data.roomName;
        if(!rooms[roomName]){ rooms[roomName] = createGameRoom(roomName) }
        socket.join(roomName);
        let reconnecting = false;
        if(isUsernameUnique(data.username, rooms[roomName])){
            socket.username = data.username;
        } else{
            socket.username = data.username+'_';
        }
        if((rooms[roomName]).savedPlayersList.indexOf(socket.username) == -1){
            addedUser = true;
            let player = createPlayerObj(socket.username, data)
            rooms[roomName] = newPlayerInRoom(rooms[roomName], player, reconnecting)
        }else{
            reconnecting = true;
        }
        userConnectedToRoom(rooms[roomName], socket.username)
        socket.emit('update player state', rooms[roomName].savedPlayers[socket.username])
        io.in(roomName).emit('update game state', rooms[roomName]);
    });

    socket.on('request server messages', (data) => {
        console.log('request server messages was hit')
        broadcastToRoom(io, data.roomName, 'server messages', data)
    })


    socket.on('disconnect', () => {
        let roomName = socket.roomName
        if (addedUser) {
            --(rooms[roomName]).numUsers;
            // console.log("numUsers", (rooms[roomName]).numUsers)
            let idx = (rooms[roomName]).connectedPlayersList.indexOf(socket.username);
            (rooms[roomName]).connectedPlayersList.splice(idx,1);

            // echo globally that this client has left
            broadcastData(socket,roomName,'user left', {
                username: socket.username,
                numUsers: (rooms[roomName]).numUsers
            });
        }
    });
    
    // this will be called when we need to update any player
    socket.on('update players', (data) => {
        rooms[socket.gameName].savedPlayers = data.players;
        if(data){
            broadcastData(socket,socket.gameName,'update game state', rooms[socket.gameName])
        }
    })
});

// HELPER FUNCTIONS
/**
 * emitData sends information to the client listening or that requested information, designed to go inside of a listener
 * @param {socket} socket 
 * @param {String} listenString 
 * @param {Object} dataObj 
 */
const emitData = (socket, listenString, dataObj) => {
    socket.emit(listenString, dataObj)
}
/**
 * broad cast to all in room exluding sender
 * @param {Socket} socket 
 * @param {String} listenString 
 * @param {Object} dataObj 
 */
const broadcastData = (socket, roomName, listenString, dataObj ) => {
    socket.to(roomName).emit(listenString, dataObj)
}

/**
 * broad cast to all in room including sender 
 * @param {*} io 
 * @param {*} roomName 
 * @param {*} listenString 
 * @param {*} dataObj 
 */
const broadcastToRoom = (io, roomName, listenString, dataObj) => { 
      io.in(roomName).emit(listenString, dataObj);}