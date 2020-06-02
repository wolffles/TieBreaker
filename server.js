const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server listening at port: ${port}`)
})
// routing
app.use(express.static(path.join(__dirname, 'public')));

//Dashboard
let numUsers = 0;
let players = [];

io.sockets.on('connect', function(socket) {
  const sessionID = socket.id;
});

io.on('connection', (socket) => {
  socket.join('game1')
    var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {

    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      event:data.event,
      result:data.result,
      message: data.message
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (data) => {
    if (addedUser) return;
    let reconnecting = false
    // we store the username in the socket session for this client
    if(players.indexOf(data.username) != -1){
      socket.username = data.username;
      console.log ("this name exists in players")
    }else if (players.indexOf(data.username) == -1){
        socket.username = data.username;
    }else{
        socket.username = data.username+'_'
    }
    ++numUsers;
    if(players.indexOf(data.username) == -1){
      players.push(socket.username);
      addedUser = true;
    }else{ 
      reconnecting = true
    }
    socket.emit('login', {
      numUsers: numUsers
    });
    console.log(reconnecting)
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      id:data.id,
      reconnecting:reconnecting
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

//updating new player with host information
socket.on('update new player', (data) => {
  io.to(data.id).emit('new player data', data.players);
});

// updating  all players with host information
socket.on('update players', (data) => {
  socket.broadcast.emit('update player data', data);
});

socket.on('update all players', (data) => {
  io.in('game1').emit('update player data' , data)
})

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;
      // let idx = players.indexOf(socket.username);
      // players.splice(idx,1);
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
})