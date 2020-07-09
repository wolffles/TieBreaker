const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

const { newPlayerInRoom, createGameRoom, createPlayerObj, userConnectedToRoom, userDisconnected, deleteRoom, removeUser } = require('./gameRoom');
const { isUsernameConnected, modifyUsername, isUsernameUnique } = require('./sourceCheck');

server.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});

//Dashboard

let rooms = {}


io.on('connection', (socket) => {
 //   socket.join('game1')
        // going to convert the code to have different rooms
      //  if(!rooms['game1']){ rooms['game1'] = createGameRoom('game1') }
   // socket.emit('update game state', rooms['game1'])

   // these variables are global inside of an indivdual connection (I think)
    let addedUser = false
    let roomName = ""
    socket.on('message', (data) => {
        broadcastRoomExcludeSender(socket, socket.roomName,'message', data);

      });

    socket.on('add user', (data) => {
        if (addedUser) return;
        roomName = data.roomName;
        socket.roomName = data.roomName;
        if(!rooms[roomName]){ rooms[roomName] = createGameRoom(roomName, data.password) }
        if(data.password == rooms[roomName].password){
            socket.join(roomName);
            if (data.reconnecting){
                socket.username = data.username;
            }else{
                if(isUsernameUnique(data.username, rooms[roomName])){
                    socket.username = data.username;
                } else{
                    socket.username = modifyUsername(data.username, rooms[roomName])
                }
                addedUser = true;
                let player = createPlayerObj(socket.username, data)
                rooms[roomName] = newPlayerInRoom(rooms[roomName], player)
            }
            userConnectedToRoom(rooms[roomName], socket.username)
            socket.emit('update player state', rooms[roomName].savedPlayers[socket.username])
            broadcastToRoom(io,roomName,'update game state', rooms[roomName]);
        }else{
            socket.emit('wrong password', roomName);
        }
    });

    socket.on('request server messages', (data) => {
        // console.log('request server messages was hit')
        emitDataToClient(socket, 'server messages', data)
    })

    socket.on('remove player',(data) =>{
       removeUser(rooms[data.roomName], data.username);
       broadcastToRoom(io, data.roomName, 'update game state', rooms[data.roomName]);
    });


    socket.on('disconnect', () => {
        let roomName = socket.roomName
        if (addedUser) {
            userDisconnected(rooms[roomName],socket.username)
            if(rooms[roomName].connectedPlayersList.length == 0){
                //deletes room after five minutes if no participant joined the room
                setTimeout(() => deleteRoom(rooms, rooms[roomName]),300000);
            }
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