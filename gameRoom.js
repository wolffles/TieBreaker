const clearToBroadcast = (room) => {
    room.toBroadcast = {
        userJoined:"",
        userLeft: "",
        userRemoved: "",
        numUsers: ""
    }
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
            life: data.life, 
            color: data.color,
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
