const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const util = require('util')

// leave me here as example on how to use
// console.log(util.inspect(myObject, false, null, true /* enable colors */))

//const {wake} = require('./wake.js')
const { newPlayerInRoom, createGameRoom, createPlayerObj, userConnectedToRoom, userDisconnected, deleteRoom, removeUser } = require('./gameRoom');
const { choosePlayer, coinToss, diceToss, modifyUsername, isUsernameUnique, updateServerGameState } = require('./sourceCheck');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000" || "http://localhost:4137",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"]
  },
  path: '/socket.io/',
  transports: ['polling', 'websocket'],
  pingTimeout: 5000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6,
  connectTimeout: 600000,
  serverClient: false,
  disconnectOnUnload: true,
  allowEIO3: true,
  allowUpgrades: true,
  cookie: false
});

// Enable CORS for all routes
// app.use(cors({
//     origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", ""],
//     methods: ["GET", "POST"],
//     credentials: true,
//     allowedHeaders: ["*"]
// }));

// Determine the environment
const isProduction = process.env.NODE_ENV === 'production';

// Serve static files from the appropriate directory
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));
} else {
  app.use(express.static(path.join(__dirname, 'frontend/public')));
}


// Add a test route to verify the server is running
app.get('/test', (req, res) => {
    res.send('Server is running!');
});

// wake();
let rooms = {}

io.on('connection', (socket) => {
    //   socket.join('game1')
    // going to convert the code to have different rooms
    //  if(!rooms['game1']){ rooms['game1'] = createGameRoom('game1') }
    // socket.emit('update game state', rooms['game1'])
    console.log('a user connected')
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

        if(rooms[roomName] && rooms[roomName].connectedPlayersList.length >= 12){
            socket.emit('too many users', roomName);
            return;
        }
        if(!rooms[roomName]){ rooms[roomName] = createGameRoom(roomName, data.password) }
        if(data.password == "FelixRocks" || data.password == rooms[roomName].password){
            socket.join(roomName);
            if (data.reconnecting){
                if(isUsernameUnique(data.username, rooms[roomName])){
                    socket.username = data.username;
                    let player = createPlayerObj(socket.username, data)
                    rooms[roomName] = newPlayerInRoom(rooms[roomName], player)
                } else{
                    socket.username = data.username;
                }
            }else{
                if(isUsernameUnique(data.username, rooms[roomName])){
                    socket.username = data.username;
                } else{
                    socket.username = modifyUsername(data.username, rooms[roomName])
                }
                let player = createPlayerObj(socket.username, data)
                rooms[roomName] = newPlayerInRoom(rooms[roomName], player)
            }
            addedUser = true;
            userConnectedToRoom(rooms[roomName], socket.username)
           // console.log(util.inspect(rooms[roomName], false, null, true))
           console.log("emitting update player state")
            socket.emit('update player state', rooms[roomName].savedPlayers[socket.username])
        }else{
            socket.emit('wrong password', roomName);
        }
    });

    socket.on('playerDashboardReady', (data) => {
        console.log("emitting update game state, rooms[roomName]", roomName, rooms[roomName])
        broadcastToRoom(io, roomName,'update game state', rooms[roomName]);
    })

    socket.on('request server messages', (data) => {
        rooms[data.roomName].broadcast = false;
        console.log("emitting server messages", data)
        emitDataToClient(socket, 'server messages', data)
    })

    socket.on('remove player',(data) =>{
        if(!rooms[data.roomName].connectedPlayersList.includes(data.username)){ 
            removeUser(rooms[data.roomName], data.username);
            broadcastToRoom(io, data.roomName, 'update game state', rooms[data.roomName]);
        }else{
            emitDataToClient(socket, 'message', {message:["Can't delete an active player", undefined]})
        }
    });


    socket.on('disconnect', () => {
        let roomName = socket.roomName
        if (addedUser) {
            userDisconnected(rooms[roomName],socket.username)
            setTimeout(() => {
                if(rooms[roomName] && rooms[roomName].connectedPlayersList.length == 0){
                    //deletes room after five minutes if no participant joined the room
                    console.log(roomName, ' is deleted')
                    deleteRoom(rooms, roomName)
                }
            }, 300000)
            // echo globally that this client has left
            broadcastRoomExcludeSender(socket,roomName,'update game state', rooms[roomName])
        }
    });
    
    // this will be called when we need to update any player
    socket.on('update players', (data) => {
        console.log("update players recieved", data)
        try {
            let roomState = rooms[roomName] 
            switch (data.action) {
                case 'setPoints':
                    for( let player in data.players ){
                        data.players[player].points.forEach((point,index) => {
                                roomState.savedPlayers[player].points[index] = point
                            })
                            if(roomState.savedPlayers[player].points.length > data.players[player].points.length){
                                roomState.savedPlayers[player].points.splice(data.players[player].points.length)
                            }
                    } 
                    break; 
                case 'deleteInput':
                    for( let player in data.players ){
                        data.players[player].points.forEach((point,index) => {
                                roomState.savedPlayers[player].points[index] = point
                            })
                    } 
                    break;
                case 'newInput box':
                    console.log('this does nothing')
                    break;
                default:
                    console.log('none of the actions were matched in update players');
            }
            if(data && data.noRender){
                broadcastRoomExcludeSender(socket,socket.roomName,'update game state', roomState)
            } else{
                broadcastToRoom(io,socket.roomName,'update game state', roomState)
            }
        } catch (error) {
            console.log("this function is wonky here is the error", error)
        }
    })

    // updating player Information
    socket.on('update player info', (data) => {
        // something werid happens when you refresh the nodemon server and there is a connected user this if statement should stop it.
        if (rooms[roomName]){
            let player = rooms[roomName].savedPlayers[data.username]
            switch (data.action) {
                case 'chat':
                    return player.messages = data.messages
                case 'scratch-pad':
                    return player.scratchPad = data.scratchPad
                case 'chat-toggle':
                    return player.chatToggle = data.chatToggle
                default:
                   console.log('none of the actions were matched in update player info');
                   break;
            } 
            // socket.emit('update player state', rooms[roomName].savedPlayers[socket.username])
        }
    })

    socket.on('roll dice', (side) => {
        let dataObject = diceToss(side)
        broadcastToRoom(io, socket.roomName, "dice is rolling", dataObject)
        // emitDataToClient(socket, "dice is rolling", data)
        // broadcastRoomExcludeSender(socket, roomName,'someone rolling dice',data)
    })

    socket.on('flip coin', () => {
        //coinToss returns array because the whole function returns an array
        let numberOfFlips = coinToss(rooms[roomName].connectedPlayers)
        broadcastToRoom(io, socket.roomName, "coin is flipping", numberOfFlips)
        // emitDataToClient(socket, "dice is rolling", data)
        // broadcastRoomExcludeSender(socket, roomName,'someone rolling dice',data)
    })

    socket.on('choose player', () => {
        let array = choosePlayer(rooms[roomName].savedPlayersList)
        broadcastToRoom(io, socket.roomName, "choosing player", array)
        // emitDataToClient(socket, "dice is rolling", data)
        // broadcastRoomExcludeSender(socket, roomName,'someone rolling dice',data)
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
    console.log(`Broadcasting '${listenString}' to room: ${roomName}`);
    console.log("Data being broadcast:", JSON.stringify(dataObj, null, 2));
    io.in(roomName).emit(listenString, dataObj);
    console.log("Broadcast complete");
}

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Use the PORT environment variable provided by Heroku
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});