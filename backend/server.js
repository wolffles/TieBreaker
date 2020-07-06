const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3001;

const { addPlayerInRoom, createGameRoom, createPlayerObj } = require('./gameRoom');
const { isUsernameUnique } = require('./sourceCheck');

server.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});


//Dashboard
// let whoIsHost = '';

let rooms = {}


io.on('connection', (socket) => {
 //   socket.join('game1')
        // going to convert the code to have different rooms
      //  if(!rooms['game1']){ rooms['game1'] = createGameRoom('game1') }
      let addedUser = false
   // socket.emit('update game state', rooms['game1'])
    socket.on('message', (data) => {
        broadcastData(socket, socket.gameName,'message', data);

      });

    socket.on('add user', (data) => {
        if (addedUser) return;
        let gameName = data.gameName;
        socket.gameName = data.gameName;
        if(!rooms[gameName]){ rooms[gameName] = createGameRoom(gameName) }
        socket.join(gameName);
        let reconnecting = false;
        if(isUsernameUnique(data.username, rooms[gameName])){
            socket.username = data.username;
        } else{
            socket.username = data.username+'_';
        }
        if((rooms[gameName]).savedPlayersList.indexOf(socket.username) == -1){
            addedUser = true;
            let player = createPlayerObj(socket.username, data)
            rooms[gameName] = addPlayerInRoom(rooms[gameName], player, reconnecting)
        }else{
            reconnecting = true;
        }
        ++(rooms[gameName]).numUsers;
        (rooms[gameName]).connectedPlayersList.push(socket.username);
        socket.emit('update player state', rooms[gameName].savedPlayers[socket.username])
        io.in(gameName).emit('update game state', rooms[gameName]);

        socket.to(gameName).emit('user joined', {
            username: socket.username,
            numUsers: (rooms[socket.gameName]).numUsers,
            id:data.id,
            reconnecting:reconnecting
        });
    });
  

    // socket.on('update new player', (data) => {
    //     io.to(data.id).emit('new player data', data);
    //   });

    socket.on('disconnect', () => {
        let gameName = socket.gameName
        if (addedUser) {
            --(rooms[gameName]).numUsers;
            console.log("numUsers", (rooms[gameName]).numUsers)
            let idx = (rooms[gameName]).connectedPlayersList.indexOf(socket.username);
            (rooms[gameName]).connectedPlayersList.splice(idx,1);

            // echo globally that this client has left
            broadcastData(socket,gameName,'user left', {
                username: socket.username,
                numUsers: (rooms[gameName]).numUsers
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
 * 
 * @param {Socket} socket 
 * @param {String} listenString 
 * @param {Object} dataObj 
 */

 //broad cast to all in room exluding sender
const broadcastData = (socket, gameName, listenString, dataObj ) => {
    socket.to(gameName).emit(listenString, dataObj)
}

//broad cast to all in room including sender
const broadcastToRoom = (io, roomname, listenString, dataObj) => {   
      io.in(roomname).emit(listenString, dataObj); }