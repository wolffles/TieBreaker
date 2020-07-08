const clearToBroadcast = (room) => {
    room.toBroadcast = {
        userJoined:"",
        userLeft: "",
        userRemoved: "",
        numUsers: ""
    }
}
module.exports = {
    createGameRoom: function(roomName) {
        return {
            roomID: '',
            roomName: roomName,
            numUsers: 0,
            connectedPlayersList: [],
            savedPlayers: {},
            savedPlayersList : [],
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
        room.toBroadcast.userJoined = [`New player, ${username} joined `, undefined]
        room.toBroadcast.numUsers = [`There's ${room.connectedPlayersList.length} participants`, undefined]
        return room
    },
    userDisconnected: function(room, username){
        let idx = room.connectedPlayersList.indexOf(username);
        room.connectedPlayersList.splice(idx,1);
        clearToBroadcast(room)
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
    }
};
