
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
            username: data.username,
            id: data.id ,
            life: data.life, 
            color: data.color
        }
    },
};
