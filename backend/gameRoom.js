
module.exports = {
    createGameRoom: function(roomname) {
        return {
            roomID: '',
            roomname: roomname,
            numUsers: 0,
            connectedPlayersList: [],
            savedPlayersList : [],
            savedPlayers: {},
            whoIsHost: ''
        }
    },
    createPlayerObj: function(username, data) {
        return {
            username: username,
            id: data.id ,
            life: data.life, 
            color: data.color,
            gameName: data.gameName
        }
    },
    addPlayerInRoom: function(room,player){
        room.savedPlayers[player.username] = player
        room.savedPlayersList.push(player.username)
        console.log(room)
        return room
    }
};
