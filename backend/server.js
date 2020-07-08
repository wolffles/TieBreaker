const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

const { newPlayerInRoom, createGameRoom, createPlayerObj, userConnectedToRoom, userDisconnected } = require('./gameRoom');
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
        broadcastRoomExcludeSender(socket, socket.roomName,'message', data);

      });

    socket.on('add user', (data) => {
        if (addedUser) return;
        let roomName = data.roomName;
        socket.roomName = data.roomName;
        if(!rooms[roomName]){ rooms[roomName] = createGameRoom(roomName, data.password) }

        if(data.password == rooms[roomName].password){
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
            broadcastToRoom(io,roomName,'update game state', rooms[roomName]);
    }else{
        socket.emit('wrong password', roomName);
    }

    });

    socket.on('request server messages', (data) => {
        console.log('request server messages was hit')
        emitDataToClient(socket, 'server messages', data)
    })


    socket.on('disconnect', () => {
        let roomName = socket.roomName
        if (addedUser) {
            userDisconnected(rooms[roomName],socket.username)
            // echo globally that this client has left
            broadcastRoomExcludeSender(socket,roomName,'update game state', rooms[roomName])
        }
    });
    
    // this will be called when we need to update any player
    socket.on('update players', (data) => {
        rooms[socket.roomName].savedPlayers = data.players;
        if(data){
            broadcastRoomExcludeSender(socket,socket.roomName,'update game state', rooms[socket.roomName])
        }
    })
});

// HELPER FUNCTIONS
/**
 * emitDataToClient sends information to the client listening or that requested information, designed to go inside of a listener
 * @param {socket} socket 
 * @param {String} listenString 
 * @param {Object} dataObj 
 */
const emitDataToClient= (socket, listenString, dataObj) => {
    socket.emit(listenString, dataObj)
}
/**
 * broad cast to all in room exluding sender
 * @param {Socket} socket 
 * @param {String} listenString 
 * @param {Object} dataObj 
 */
const broadcastRoomExcludeSender = (socket, roomName, listenString, dataObj ) => {
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