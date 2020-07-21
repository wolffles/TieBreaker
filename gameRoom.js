const clearToBroadcast = (room) => {
    room.toBroadcast = {
        userJoined:"",
        userLeft: "",
        userRemoved: "",
        numUsers: ""
    }
}

const COLORS2 = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  const COLORS = [
    '#1A1A1D', '#4E4E50', '#6F2232', '#950740', '#C3073F'
  ];

  //colors corelate to #4 in following link: https://digitalsynopsis.com/design/website-color-schemes-palettes-combinations/

// Gets the color of a username through our hash function
const getUsernameColor = (username) => {
  // Compute hash code
  var hash = 7;
  for (var i = 0; i < username.length; i++) {
     hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  var index = Math.abs(hash % COLORS.length);
  return COLORS[index];
}


module.exports = {
    createGameRoom: function(roomName, password) {
        return {
            roomID: '',
            password: password,
            roomName: roomName,
            numUsers: 0,
            connectedPlayersList: [],
            savedPlayers: {},
            savedPlayersList : [],
            broadcast: false,
            toBroadcast: {
                userJoined:"",
                userLeft: "",
                userRemoved: "",
                numUsers: ""
            }
        }
    },
    createPlayerObj: function(username, data) {
        return {
            username: username,
            id: data.id ,
            score: 0,
            score2: 0,
            secondInput: false,
            password: data.password, 
            color: getUsernameColor(username),
            roomName: data.roomName,
            messages: [['Welcome To TieBreaker', undefined]]
        }
    },
    newPlayerInRoom: function(room,player){
        room.savedPlayers[player.username] = player
        room.savedPlayersList.push(player.username)
        return room
    },
    userConnectedToRoom: function(room, username){
        room.connectedPlayersList.push(username);
        clearToBroadcast(room)
        room.broadcast = true
        room.toBroadcast.userJoined = [`New player, ${username} joined `, undefined]
        room.toBroadcast.numUsers = [`There's ${room.connectedPlayersList.length} participants`, undefined]
        return room
    },
    userDisconnected: function(room, username){
        let idx = room.connectedPlayersList.indexOf(username);
        room.connectedPlayersList.splice(idx,1);
        clearToBroadcast(room)
        room.broadcast = true
        room.toBroadcast.userLeft = [username + " left the room"]
        room.toBroadcast.numUsers = [`There's ${room.connectedPlayersList.length} participants`, undefined]
    },
    clearToBroadcast: function(room){
        room.toBroadcast = {
            userJoined:"",
            userLeft: "",
            userRemoved: "",
            numUsers: ""
        }

    },
    removeUser: function(room, username){
        delete room.savedPlayers[username];
        let idx = room.savedPlayersList.indexOf(username);
        room.savedPlayersList.splice(idx,1);
        clearToBroadcast(room);
        room.broadcast = true
        room.toBroadcast.userRemoved = [`${username}'s player area was removed.`, undefined]

    },
    deleteRoom(rooms, roomName){
        if (rooms[roomName].connectedPlayersList.length == 0){
            delete rooms[roomName];
        }
    }

};
