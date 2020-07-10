/*
sourceCheck is a module that provides helpers for checking the source of truth.
**/

module.exports = {
    isUsernameUnique: (username, roomData) => {
        return roomData.savedPlayersList.indexOf(username) == -1
    },
    isUsernameConnected: (username, roomData) => {
        return roomData.connectedPlayersList.indexOf(username) == -1
    },
    modifyUsername: (username, roomData) => {
        console.log('in modifyUserName')
        let reg = /\d+$/
        let sub = username.match(reg)
        // if substring doesn't have any numbers(null) else add on to it
        username = sub == null ? username+'1' : username.replace(reg,(Number(sub)+1))
        while (roomData.savedPlayersList.indexOf(username) != -1){
            sub = username.match(reg)
            username = username.replace(reg,(Number(sub)+1))
        }
        return username 
    }

};