
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
            gameName: data.gameName,
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
        room.toBroadcast.userJoined = [`New player, ${username} joined `, undefined]
        room.toBroadcast.numUsers = [`There are ${room.connectedPlayersList.length} in the room`, undefined]
        return room
    }
};
